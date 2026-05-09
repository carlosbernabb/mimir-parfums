import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("products")
    .select("id, name, image, price, sale_label, sale_ends")
    .eq("is_hero", true)
    .eq("active", true)
    .single();

  return NextResponse.json({ hero: data ?? null });
}
