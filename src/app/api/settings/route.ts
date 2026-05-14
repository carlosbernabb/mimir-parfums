import { NextResponse } from "next/server";
import { getShippingSettings } from "@/lib/shipping-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pricing = await getShippingSettings();
    return NextResponse.json({ pricing });
  } catch (error) {
    console.error("Settings lookup error:", error);
    return NextResponse.json({ error: "Error al cargar configuracion" }, { status: 500 });
  }
}
