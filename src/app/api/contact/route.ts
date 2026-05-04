import { NextRequest, NextResponse } from "next/server";
import { sendContactToAdmin } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { orderId, email, message } = await req.json();

  if (!email || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    await sendContactToAdmin(orderId || "", email, message);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact email error:", e);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}
