import { supabase } from "@/lib/supabase";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, type PricingSettings } from "@/lib/pricing";

const BUCKET = "mimir-settings";
const FILE = "shipping-settings.json";

const defaultSettings: PricingSettings = {
  shippingCost: SHIPPING_COST,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  updatedAt: new Date().toISOString(),
};

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, { public: false });
  }
}

function sanitizeSettings(input: Partial<PricingSettings>): PricingSettings {
  const shippingCost = Number(input.shippingCost ?? SHIPPING_COST);
  const freeShippingThreshold = Number(input.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD);

  if (!Number.isFinite(shippingCost) || shippingCost < 0) {
    throw new Error("Costo de envio invalido");
  }

  if (!Number.isFinite(freeShippingThreshold) || freeShippingThreshold < 0) {
    throw new Error("Monto para envio gratis invalido");
  }

  return {
    shippingCost: Math.round(shippingCost),
    freeShippingThreshold: Math.round(freeShippingThreshold),
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}

async function writeSettings(settings: PricingSettings) {
  await ensureBucket();
  const body = JSON.stringify(settings, null, 2);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE, body, { contentType: "application/json", upsert: true });
  if (error) throw error;
}

export async function getShippingSettings() {
  await ensureBucket();
  const { data, error } = await supabase.storage.from(BUCKET).download(FILE);

  if (error || !data) {
    await writeSettings(defaultSettings);
    return defaultSettings;
  }

  return sanitizeSettings(JSON.parse(await data.text()) as Partial<PricingSettings>);
}

export async function updateShippingSettings(input: Partial<PricingSettings>) {
  const settings = sanitizeSettings({ ...input, updatedAt: new Date().toISOString() });
  await writeSettings(settings);
  return settings;
}
