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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type GeneratedProductCopy = {
  subtitle: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
};

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("Claude no devolvio JSON");
  return text.slice(start, end + 1);
}

function validateGeneratedCopy(value: Partial<GeneratedProductCopy>): GeneratedProductCopy {
  const notes = value.notes;
  if (
    !value.subtitle?.trim() ||
    !value.description?.trim() ||
    !notes ||
    !Array.isArray(notes.top) ||
    !Array.isArray(notes.heart) ||
    !Array.isArray(notes.base) ||
    notes.top.length === 0 ||
    notes.heart.length === 0 ||
    notes.base.length === 0
  ) {
    throw new Error("La IA devolvio datos incompletos");
  }

  return {
    subtitle: value.subtitle.trim(),
    description: value.description.trim(),
    notes: {
      top: notes.top.map((note) => String(note).trim()).filter(Boolean),
      heart: notes.heart.map((note) => String(note).trim()).filter(Boolean),
      base: notes.base.map((note) => String(note).trim()).filter(Boolean),
    },
  };
}

async function generateProductCopy(name: string, volume: string): Promise<GeneratedProductCopy> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en Vercel");
  }

  const client = new Anthropic({ apiKey });
  const prompt = `Eres un experto en perfumeria de lujo arabe escribiendo para MIMIR Parfums, una boutique mexicana de perfumes arabes de elite. El estilo debe ser elegante, poetico y sensorial, en espanol.

Dado el perfume: "${name}" (${volume})

Genera en JSON (sin markdown, solo el objeto):
{
  "subtitle": "frase corta de 4-7 palabras, elegante y evocadora",
  "description": "2-3 oraciones poeticas describiendo el perfume: apertura, corazon y base; para quien es ideal; cuando usarlo",
  "notes": {
    "top": ["nota1", "nota2", "nota3"],
    "heart": ["nota1", "nota2"],
    "base": ["nota1", "nota2"]
  }
}

Reglas:
- Solo JSON valido, sin texto adicional
- Notas en espanol (Ambar, Sandalo, Rosa, etc.)
- Top: 3-5 notas, Heart: 2-4 notas, Base: 2-4 notas
- Descripcion: maximo 3 oraciones, estilo elegante y sensorial`;

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Claude no devolvio texto");

  return validateGeneratedCopy(JSON.parse(extractJson(textBlock.text)));
}

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

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = ((formData.get("name") as string) || "").trim();
  const price = parseInt(formData.get("price") as string, 10);
  const volume = ((formData.get("volume") as string) || "100ml").trim();
  const originalPrice = formData.get("originalPrice") ? parseInt(formData.get("originalPrice") as string, 10) : null;
  const saleLabel = ((formData.get("saleLabel") as string) || "").trim() || null;
  const saleEnds = ((formData.get("saleEnds") as string) || "").trim() || null;
  const imageFile = formData.get("image") as File | null;

  if (!name || !price) {
    return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 });
  }

  let generated: GeneratedProductCopy;
  try {
    generated = await generateProductCopy(name, volume);
  } catch (error) {
    console.error("AI product generation error:", error);
    return NextResponse.json(
      { error: "La IA no pudo generar la descripcion. Revisa ANTHROPIC_API_KEY/ANTHROPIC_MODEL en Vercel e intenta de nuevo." },
      { status: 502 }
    );
  }

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

  const id = `${slugify(name)}-${Date.now()}`;

  await supabase.rpc("increment_product_positions");

  const { data, error } = await supabase.from("products").insert({
    id,
    name,
    subtitle: generated.subtitle,
    description: generated.description,
    notes: generated.notes,
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

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
