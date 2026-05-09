import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  return req.headers.get("Authorization") === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET — list all products from DB
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST — create product (multipart: image + fields + AI generation)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = ((formData.get("name") as string) || "").trim();
  const price = parseInt(formData.get("price") as string, 10);
  const volume = (formData.get("volume") as string) || "100ml";
  const originalPrice = formData.get("originalPrice") ? parseInt(formData.get("originalPrice") as string, 10) : null;
  const saleLabel = (formData.get("saleLabel") as string) || null;
  const saleEnds = (formData.get("saleEnds") as string) || null;
  const imageFile = formData.get("image") as File | null;

  if (!name || !price) {
    return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 });
  }

  // 1. Upload image to Supabase Storage
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const filename = `${slugify(name)}-${Date.now()}.${ext}`;
    const bytes = await imageFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, bytes, { contentType: imageFile.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: `Error subiendo imagen: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filename);
    imageUrl = urlData.publicUrl;
  }

  // 2. Generate description + notes with Claude
  let subtitle = "";
  let description = "";
  let notes: { top: string[]; heart: string[]; base: string[] } = { top: [], heart: [], base: [] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const client = new Anthropic({ apiKey });
      const prompt = `Eres un experto en perfumería de lujo árabe escribiendo para MIMIR Parfums, una boutique mexicana de perfumes árabes de élite. El estilo debe ser elegante, poético y sensorial, en español.

Dado el perfume: "${name}" (${volume})

Genera en JSON (sin markdown, solo el objeto):
{
  "subtitle": "frase corta de 4-7 palabras, elegante y evocadora",
  "description": "2-3 oraciones poéticas describiendo el perfume: apertura, corazón y base; para quién es ideal; cuándo usarlo",
  "notes": {
    "top": ["nota1", "nota2", "nota3"],
    "heart": ["nota1", "nota2"],
    "base": ["nota1", "nota2"]
  }
}

Reglas:
- Solo JSON válido, sin texto adicional
- Notas en español (Ámbar, Sándalo, Rosa, etc.)
- Top: 3-5 notas, Heart: 2-4 notas, Base: 2-4 notas
- Descripción: máximo 3 oraciones, estilo elegante y sensorial`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      });

      const text = (message.content[0] as { type: string; text: string }).text.trim();
      const parsed = JSON.parse(text);
      subtitle = parsed.subtitle ?? "";
      description = parsed.description ?? "";
      notes = parsed.notes ?? { top: [], heart: [], base: [] };
    } catch {
      subtitle = name;
      description = "";
      notes = { top: [], heart: [], base: [] };
    }
  } else {
    subtitle = name;
  }

  // 3. Save to DB — assign position 0 so it appears at top, then shift others down
  const id = `${slugify(name)}-${Date.now()}`;

  // Shift all existing products down by 1
  await supabase.rpc("increment_product_positions");

  const { data, error } = await supabase.from("products").insert({
    id,
    name,
    subtitle,
    description,
    notes,
    price,
    original_price: originalPrice,
    sale_label: saleLabel,
    sale_ends: saleEnds,
    volume,
    image: imageUrl,
    active: true,
    position: 1,
  }).select().single();

  if (error) return NextResponse.json({ error: `Error guardando: ${error.message}` }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}

// PATCH — reorder products
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order } = await req.json() as { order: string[] };
  if (!Array.isArray(order)) return NextResponse.json({ error: "order array required" }, { status: 400 });

  const updates = order.map((id, index) =>
    supabase.from("products").update({ position: index + 1 }).eq("id", id)
  );

  await Promise.all(updates);
  return NextResponse.json({ ok: true });
}

// DELETE — deactivate product
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
