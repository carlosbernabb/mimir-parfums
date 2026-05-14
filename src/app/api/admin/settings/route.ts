import { NextRequest, NextResponse } from "next/server";
import { getShippingSettings, updateShippingSettings } from "@/lib/shipping-settings";

export const dynamic = "force-dynamic";

function auth(req: NextRequest) {
  return req.headers.get("Authorization") === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pricing = await getShippingSettings();
    return NextResponse.json({ pricing });
  } catch (error) {
    console.error("Admin settings lookup error:", error);
    return NextResponse.json({ error: "Error al cargar configuracion" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const pricing = await updateShippingSettings({
      shippingCost: body.shippingCost,
      freeShippingThreshold: body.freeShippingThreshold,
    });
    return NextResponse.json({ pricing });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error guardando configuracion" },
      { status: 400 }
    );
  }
}
