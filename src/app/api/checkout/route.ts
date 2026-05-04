import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { generateOrderId } from "@/lib/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { items, shipping, discountApplied } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const SHIPPING_COST = 180;
    const FREE_SHIPPING_THRESHOLD = 1900;

    const subtotalMxn = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );
    const shippingMxn = (discountApplied || subtotalMxn >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    const totalMxn = subtotalMxn + shippingMxn;

    // Generate unique order ID (retry if collision)
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

    // Save order with pending_payment status
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

    const lineItems: object[] = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "mxn",
        product_data: {
          name: `MIMIR Parfums — ${item.name}`,
          description: "Eau de Parfum 30ml",
          images: [`${process.env.NEXT_PUBLIC_URL}/MIMIR_LOGO.png`],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    if (shippingMxn > 0) {
      lineItems.push({
        price_data: {
          currency: "mxn",
          product_data: { name: "Envío a México" },
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
          message: `Envío a: ${shipping.calle} ${shipping.numero}, ${shipping.colonia}, ${shipping.ciudad}, ${shipping.estado} CP ${shipping.codigoPostal}`,
        },
      },
      payment_intent_data: {
        description: `MIMIR Parfums — ${orderId} — ${shipping.nombre}`,
        metadata: { order_id: orderId, nombre: shipping.nombre, telefono: shipping.telefono },
      },
    });

    // Store Stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("order_id", orderId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Error al crear la sesión de pago" }, { status: 500 });
  }
}
