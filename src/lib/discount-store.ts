import { supabase } from "@/lib/supabase";
import { defaultDiscountCodes, normalizeDiscountCode, type DiscountCode, type DiscountType } from "@/lib/discounts";

const BUCKET = "mimir-settings";
const FILE = "discount-codes.json";

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, { public: false });
  }
}

function sanitizeDiscount(input: Partial<DiscountCode>): DiscountCode {
  const code = normalizeDiscountCode(String(input.code ?? ""));
  const type = String(input.type ?? "free_shipping") as DiscountType;
  const value = Number(input.value ?? 0);

  if (!code) throw new Error("Codigo requerido");
  if (!["free_shipping", "percent", "fixed_amount"].includes(type)) throw new Error("Tipo de descuento invalido");
  if (type === "percent" && (value <= 0 || value > 100)) throw new Error("Porcentaje invalido");
  if (type === "fixed_amount" && value <= 0) throw new Error("Monto invalido");

  return {
    code,
    type,
    value: type === "free_shipping" ? 0 : Math.round(value),
    active: input.active ?? true,
    label: String(input.label ?? "").trim() || code,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

async function writeDiscounts(discounts: DiscountCode[]) {
  await ensureBucket();
  const body = JSON.stringify({ discounts }, null, 2);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE, body, { contentType: "application/json", upsert: true });
  if (error) throw error;
}

export async function getDiscounts() {
  await ensureBucket();
  const { data, error } = await supabase.storage.from(BUCKET).download(FILE);

  if (error || !data) {
    await writeDiscounts(defaultDiscountCodes);
    return defaultDiscountCodes;
  }

  const parsed = JSON.parse(await data.text()) as { discounts?: Partial<DiscountCode>[] };
  const discounts = (parsed.discounts ?? []).map(sanitizeDiscount);

  if (discounts.length === 0) {
    await writeDiscounts(defaultDiscountCodes);
    return defaultDiscountCodes;
  }

  return discounts;
}

export async function saveDiscount(input: Partial<DiscountCode>) {
  const nextDiscount = sanitizeDiscount(input);
  const discounts = await getDiscounts();
  const existing = discounts.findIndex((discount) => discount.code === nextDiscount.code);
  const next = existing >= 0
    ? discounts.map((discount) => discount.code === nextDiscount.code ? { ...discount, ...nextDiscount, createdAt: discount.createdAt } : discount)
    : [nextDiscount, ...discounts];

  await writeDiscounts(next);
  return nextDiscount;
}

export async function updateDiscount(code: string, patch: Partial<DiscountCode>) {
  const normalized = normalizeDiscountCode(code);
  const discounts = await getDiscounts();
  const current = discounts.find((discount) => discount.code === normalized);
  if (!current) throw new Error("Codigo no encontrado");
  const updated = sanitizeDiscount({ ...current, ...patch, code: normalized, createdAt: current.createdAt });
  await writeDiscounts(discounts.map((discount) => discount.code === normalized ? updated : discount));
  return updated;
}

export async function deleteDiscount(code: string) {
  const normalized = normalizeDiscountCode(code);
  const discounts = await getDiscounts();
  await writeDiscounts(discounts.filter((discount) => discount.code !== normalized));
}

export async function findActiveDiscount(code: string) {
  const normalized = normalizeDiscountCode(code);
  const discounts = await getDiscounts();
  return discounts.find((discount) => discount.code === normalized && discount.active) ?? null;
}
