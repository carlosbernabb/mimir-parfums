import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { products as staticProducts } from "@/lib/products";

export async function GET() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const dbProducts = (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    notes: p.notes,
    price: p.price,
    ...(p.original_price ? { originalPrice: p.original_price } : {}),
    ...(p.sale_label ? { saleLabel: p.sale_label } : {}),
    ...(p.sale_ends ? { saleEnds: p.sale_ends } : {}),
    volume: p.volume,
    image: p.image,
    ...(p.stripe_price_id ? { stripePriceId: p.stripe_price_id } : {}),
    ...(p.stock !== null ? { stock: p.stock } : {}),
  }));

  return NextResponse.json({ products: [...dbProducts, ...staticProducts] });
}
