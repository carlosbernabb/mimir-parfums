import { NextRequest, NextResponse } from "next/server";
import { deleteDiscount, getDiscounts, saveDiscount, updateDiscount } from "@/lib/discount-store";

function auth(req: NextRequest) {
  return req.headers.get("Authorization") === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const discounts = await getDiscounts();
  return NextResponse.json({ discounts });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const discount = await saveDiscount(await req.json());
    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error guardando descuento" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { code, ...patch } = await req.json();
    const discount = await updateDiscount(code, patch);
    return NextResponse.json({ discount });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error actualizando descuento" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Codigo requerido" }, { status: 400 });
  await deleteDiscount(code);
  return NextResponse.json({ ok: true });
}
