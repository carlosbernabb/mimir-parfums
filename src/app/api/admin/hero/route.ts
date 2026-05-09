import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  return req.headers.get("Authorization") === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { heroProductId, price, sale_label, sale_ends } = await req.json();

  if (heroProductId) {
    await supabase.from("products").update({ is_hero: false }).neq("id", heroProductId);
    await supabase.from("products").update({ is_hero: true }).eq("id", heroProductId);
  }

  const updates: Record<string, unknown> = {};
  if (price !== undefined) updates.price = price;
  if (sale_label !== undefined) updates.sale_label = sale_label || null;
  if (sale_ends !== undefined) updates.sale_ends = sale_ends || null;

  if (Object.keys(updates).length > 0) {
    const targetId = heroProductId ?? (
      await supabase.from("products").select("id").eq("is_hero", true).single()
    ).data?.id;
    if (targetId) await supabase.from("products").update(updates).eq("id", targetId);
  }

  return NextResponse.json({ ok: true });
}
