import { NextRequest, NextResponse } from "next/server";
import { getShippingSettings } from "@/lib/shipping-settings";
import { isSkydropxConfigured, quoteCheapestEstafeta } from "@/lib/skydropx";

export const dynamic = "force-dynamic";

type QuoteItemInput = {
  quantity: number;
};

type ShippingInput = {
  codigoPostal?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeItems(items: unknown): QuoteItemInput[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({ quantity: Number((item as QuoteItemInput).quantity) }))
    .filter((item) => Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10);
}

function normalizeShipping(input: ShippingInput | undefined) {
  return {
    codigoPostal: cleanText(input?.codigoPostal).replace(/\D/g, ""),
    colonia: cleanText(input?.colonia),
    ciudad: cleanText(input?.ciudad),
    estado: cleanText(input?.estado),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = normalizeItems(body.items);
    const shipping = normalizeShipping(body.shipping);

    if (!items.length || shipping.codigoPostal.length !== 5 || !shipping.colonia || !shipping.ciudad || !shipping.estado) {
      return NextResponse.json({ error: "Datos insuficientes para cotizar envio" }, { status: 400 });
    }

    if (!isSkydropxConfigured()) {
      const pricing = await getShippingSettings();
      return NextResponse.json({
        quote: {
          amount: pricing.shippingCost,
          carrier: "Envio nacional",
          service: "Tarifa configurada",
          days: null,
          source: "manual",
        },
      });
    }

    try {
      const quote = await quoteCheapestEstafeta(shipping, items);
      return NextResponse.json({ quote: { ...quote, source: "skydropx" } });
    } catch {
      const pricing = await getShippingSettings();
      return NextResponse.json({
        quote: {
          amount: pricing.shippingCost,
          carrier: "Envio nacional",
          service: "Tarifa fija",
          days: null,
          source: "manual",
        },
      });
    }
  } catch (error) {
    console.error("Shipping quote error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo cotizar el envio" },
      { status: 502 }
    );
  }
}
