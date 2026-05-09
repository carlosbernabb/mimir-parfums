import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { generateOrderId } from "@/lib/orders";
import {
  DISCOUNT_CODE,
  DISCOUNT_CODE_PERCENT,
  DISCOUNT_PERCENT_VALUE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

type CheckoutItemInput = {
  id: string;
  quantity: number;
};

type ShippingInput = {
  nombre: string;
  email: string;
  telefono: string;
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
};

type DbProduct = {
  id: string;
  name: string;
  price: number;
  volume: string;
  active: boolean;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeShipping(shipping: Partial<ShippingInput> | undefined): ShippingInput | null {
  if (!shipping) return null;

  const normalized = {
    nombre: cleanText(shipping.nombre),
    email: cleanText(shipping.email).toLowerCase(),
    telefono: cleanText(shipping.telefono),
    calle: cleanText(shipping.calle),
    numero: cleanText(shipping.numero),
    colonia: cleanText(shipping.colonia),
    ciudad: cleanText(shipping.ciudad),
    estado: cleanText(shipping.estado),
    codigoPostal: cleanText(shipping.codigoPostal),
  };

  const required: (keyof ShippingInput)[] = [
    "nombre",
    "email",
    "telefono",
    "calle",
    "numero",
    "colonia",
    "ciudad",
    "estado",
    "codigoPostal",
  ];

  if (required.some((field) => !normalized[field])) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) return null;

  return normalized;
}

function normalizeItems(items: unknown): CheckoutItemInput[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      id: cleanText((item as CheckoutItemInput).id),
      quantity: Number((item as CheckoutItemInput).quantity),
    }))
    .filter((item) => item.id && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestedItems = normalizeItems(body.items);
    const shipping = normalizeShipping(body.shipping);
    const discountCode = cleanText(body.discountCode).toUpperCase();

    if (!requestedItems.length) {
      return NextResponse.json({ error: "Carrito vacio" }, { status: 400 });
    }

    if (!shipping) {
      return NextResponse.json({ error: "Datos de envio incompletos" }, { status: 400 });
    }

    const productIds = [...new Set(requestedItems.map((item) => item.id))];
    const { data: dbProducts, error: productError } = await supabase
      .from("products")
      .select("id,name,price,volume,active")
      .in("id", productIds)
      .eq("active", true);

    if (productError) {
      console.error("Supabase product lookup error:", productError);
      return NextResponse.json({ error: "Error al validar productos" }, { status: 500 });
    }

    if (!dbProducts || dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "Uno o mas productos ya no estan disponibles" }, { status: 400 });
    }

    const productById = new Map((dbProducts as DbProduct[]).map((product) => [product.id, product]));
    const items = requestedItems.map((item) => {
      const product = productById.get(item.id)!;
      return {
        id: product.id,
        name: product.name.trim(),
        price: product.price,
        volume: product.volume,
        quantity: item.quantity,
      };
    });

    const subtotalMxn = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountPercent = discountCode === DISCOUNT_CODE_PERCENT ? DISCOUNT_PERCENT_VALUE : 0;
    const discountAmountMxn = discountPercent > 0 ? Math.round((subtotalMxn * discountPercent) / 100) : 0;
    const freeShippingCodeApplied = discountCode === DISCOUNT_CODE;
    const shippingMxn = freeShippingCodeApplied || subtotalMxn >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalMxn = subtotalMxn - discountAmountMxn + shippingMxn;

    let orderId = generateOrderId();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data } = await supabase
        .from("orders")
        .select("order_id")
        .eq("order_id", orderId)
        .maybeSingle();
      if (!data) break;
      orderId = generateOrderId();
    }

    const { error: insertError } = await supabase.from("orders").insert({
      order_id: orderId,
      status: "pending_payment",
      customer_email: shipping.email,
      items,
      shipping,
      total_mxn: totalMxn,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 });
    }

    const discountMultiplier = discountPercent > 0 ? 1 - discountPercent / 100 : 1;
    const lineItems: object[] = items.map((item) => ({
      price_data: {
        currency: "mxn",
        product_data: {
          name: `MIMIR Parfums - ${item.name}${discountPercent > 0 ? ` (-${discountPercent}%)` : ""}`,
          description: `Eau de Parfum ${item.volume}`,
          images: [`${process.env.NEXT_PUBLIC_URL}/MIMIR_LOGO.png`],
        },
        unit_amount: Math.round(item.price * discountMultiplier) * 100,
      },
      quantity: item.quantity,
    }));

    if (shippingMxn > 0) {
      lineItems.push({
        price_data: {
          currency: "mxn",
          product_data: { name: "Envio a Mexico" },
          unit_amount: shippingMxn * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/exito?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      customer_email: shipping.email,
      locale: "es",
      metadata: { order_id: orderId },
      custom_text: {
        submit: {
          message: `Envio a: ${shipping.calle} ${shipping.numero}, ${shipping.colonia}, ${shipping.ciudad}, ${shipping.estado} CP ${shipping.codigoPostal}`,
        },
      },
      payment_intent_data: {
        description: `MIMIR Parfums - ${orderId} - ${shipping.nombre}`,
        metadata: { order_id: orderId, nombre: shipping.nombre, telefono: shipping.telefono },
      },
    });

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("order_id", orderId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Error al crear la sesion de pago" }, { status: 500 });
  }
}
