import { NextRequest, NextResponse } from "next/server";
import { findActiveDiscount } from "@/lib/discount-store";
import { normalizeDiscountCode } from "@/lib/discounts";

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  const normalized = normalizeDiscountCode(String(code ?? ""));
  if (!normalized) return NextResponse.json({ valid: false }, { status: 400 });

  const discount = await findActiveDiscount(normalized);
  if (!discount) return NextResponse.json({ valid: false }, { status: 404 });

  return NextResponse.json({ valid: true, discount });
}
