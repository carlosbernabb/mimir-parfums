type ShippingAddress = {
  codigoPostal: string;
  colonia: string;
  ciudad: string;
  estado: string;
};

type QuoteItem = {
  quantity: number;
};

export type ShippingRateQuote = {
  amount: number;
  carrier: string;
  service: string;
  days: number | null;
  rateId: string | null;
  quotationId: string | null;
};

type SkydropxRate = {
  id?: string;
  success?: boolean;
  provider_name?: string;
  provider_display_name?: string;
  provider_service_name?: string;
  provider_service_code?: string;
  currency_code?: string;
  amount?: string | number;
  total?: string | number;
  days?: number | null;
};

type SkydropxQuotation = {
  id?: string;
  is_completed?: boolean;
  rates?: SkydropxRate[];
  data?: unknown;
  included?: unknown[];
};

const SKYDROPX_BASE_URL = (process.env.SKYDROPX_BASE_URL || "https://pro.skydropx.com/api/v1").replace(/\/$/, "");
const ORIGIN_ADDRESS_TEMPLATE_ID = process.env.SKYDROPX_ORIGIN_ADDRESS_TEMPLATE_ID || "";
const ORIGIN_POSTAL_CODE = process.env.SKYDROPX_ORIGIN_POSTAL_CODE || "76269";
const ORIGIN_STATE = process.env.SKYDROPX_ORIGIN_STATE || "Queretaro";
const ORIGIN_CITY = process.env.SKYDROPX_ORIGIN_CITY || "Queretaro";
const ORIGIN_COLONY = process.env.SKYDROPX_ORIGIN_COLONY || "Queretaro";

// OAuth token cache (module-level, lives for the duration of the serverless instance)
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getApiToken(): Promise<string> {
  // Static token takes priority (manual override)
  const staticToken = process.env.SKYDROPX_BEARER_TOKEN || process.env.SKYDROPX_API_TOKEN || "";
  if (staticToken) return staticToken;

  const clientId = process.env.SKYDROPX_CLIENT_ID || "";
  const clientSecret = process.env.SKYDROPX_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) return "";

  // Return cached token if still valid (with 5-min buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
    return cachedToken.value;
  }

  const res = await fetch(`${SKYDROPX_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
  });
  if (!res.ok) throw new Error(`Skydropx OAuth fallo ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function cleanText(value: string) {
  return value.trim();
}

function normalizePostalCode(value: string) {
  return cleanText(value).replace(/\D/g, "");
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildParcel(items: QuoteItem[]) {
  const quantity = Math.max(1, items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0));
  const weightPerItem = Number(process.env.SKYDROPX_PACKAGE_WEIGHT_KG || 1);
  const length = Number(process.env.SKYDROPX_PACKAGE_LENGTH_CM || 15);
  const width = Number(process.env.SKYDROPX_PACKAGE_WIDTH_CM || 10);
  const baseHeight = Number(process.env.SKYDROPX_PACKAGE_HEIGHT_CM || 15);
  const extraHeightPerItem = Number(process.env.SKYDROPX_PACKAGE_EXTRA_HEIGHT_CM || 0);

  return {
    length: Math.max(1, Math.round(length)),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(baseHeight + Math.max(0, quantity - 1) * extraHeightPerItem)),
    weight: Math.max(1, Math.ceil(quantity * weightPerItem)),
    package_protected: false,
    declared_value: 0,
  };
}

function extractQuotation(raw: unknown): SkydropxQuotation {
  const response = raw as SkydropxQuotation;
  const data = response.data as SkydropxQuotation | { id?: string; attributes?: SkydropxQuotation } | undefined;
  const attributes = data && "attributes" in data ? data.attributes : undefined;

  return {
    ...response,
    ...(data && !Array.isArray(data) ? data : {}),
    ...(attributes ?? {}),
    id: response.id ?? (data && !Array.isArray(data) ? data.id : undefined) ?? attributes?.id,
    rates: response.rates ?? attributes?.rates,
  };
}

function ratesFrom(raw: unknown) {
  const quotation = extractQuotation(raw);
  const includedRates = Array.isArray(quotation.included)
    ? quotation.included
        .map((item) => {
          const entry = item as { id?: string; type?: string; attributes?: SkydropxRate };
          return entry.type === "rate" ? { id: entry.id, ...entry.attributes } : null;
        })
        .filter(Boolean) as SkydropxRate[]
    : [];

  return quotation.rates ?? includedRates;
}

function chooseCheapestEstafeta(raw: unknown) {
  const rates = ratesFrom(raw);

  return rates
    .filter((rate) => {
      const provider = `${rate.provider_name ?? ""} ${rate.provider_display_name ?? ""}`.toLowerCase();
      return rate.success !== false && provider.includes("estafeta") && rate.currency_code?.toUpperCase() !== "USD";
    })
    .map((rate) => {
      const amount = numberValue(rate.total ?? rate.amount);
      if (amount === null) return null;
      return { rate, amount };
    })
    .filter(Boolean)
    .sort((a, b) => a!.amount - b!.amount)[0] ?? null;
}

async function skydropxFetch(path: string, init?: RequestInit) {
  const token = await getApiToken();
  if (!token) throw new Error("Faltan credenciales de Skydropx en variables de entorno");

  const res = await fetch(`${SKYDROPX_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`Skydropx respondio ${res.status}: ${text.slice(0, 300)}`);
  }

  return data;
}

export function isSkydropxConfigured() {
  return Boolean(
    process.env.SKYDROPX_BEARER_TOKEN ||
    process.env.SKYDROPX_API_TOKEN ||
    (process.env.SKYDROPX_CLIENT_ID && process.env.SKYDROPX_CLIENT_SECRET)
  );
}

function buildOriginAddress() {
  if (ORIGIN_ADDRESS_TEMPLATE_ID) {
    return {
      address_template_id: ORIGIN_ADDRESS_TEMPLATE_ID,
      country_code: "MX",
      postal_code: ORIGIN_POSTAL_CODE,
    };
  }

  return {
    country_code: "MX",
    postal_code: ORIGIN_POSTAL_CODE,
    area_level1: ORIGIN_STATE,
    area_level2: ORIGIN_CITY,
    area_level3: ORIGIN_COLONY,
  };
}

export async function quoteCheapestEstafeta(address: ShippingAddress, items: QuoteItem[]): Promise<ShippingRateQuote> {
  const postalCode = normalizePostalCode(address.codigoPostal);
  if (postalCode.length !== 5) throw new Error("Codigo postal invalido");

  const quotationPayload = {
    quotation: {
      address_from: buildOriginAddress(),
      address_to: {
        country_code: "MX",
        postal_code: postalCode,
        area_level1: cleanText(address.estado),
        area_level2: cleanText(address.ciudad),
        area_level3: cleanText(address.colonia),
      },
      parcels: [buildParcel(items)],
      requested_carriers: ["estafeta"],
    },
  };

  let quotation = await skydropxFetch("/quotations", {
    method: "POST",
    body: JSON.stringify(quotationPayload),
  });
  let parsed = extractQuotation(quotation);

  for (let attempt = 0; attempt < 4 && parsed.id && !chooseCheapestEstafeta(quotation); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    quotation = await skydropxFetch(`/quotations/${parsed.id}`);
    parsed = extractQuotation(quotation);
    if (parsed.is_completed && !chooseCheapestEstafeta(quotation)) break;
  }

  const cheapest = chooseCheapestEstafeta(quotation);
  if (!cheapest) throw new Error("Skydropx no devolvio tarifas de Estafeta para ese CP");

  const rate = cheapest.rate;
  return {
    amount: Math.ceil(cheapest.amount) + 25,
    carrier: rate.provider_display_name || rate.provider_name || "Estafeta",
    service: rate.provider_service_name || rate.provider_service_code || "Servicio Estafeta",
    days: typeof rate.days === "number" ? rate.days : null,
    rateId: rate.id ?? null,
    quotationId: parsed.id ?? null,
  };
}
