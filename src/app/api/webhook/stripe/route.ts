import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { sendNewOrderToAdmin, sendConfirmationToCustomer } from "@/lib/email";
import { Order } from "@/lib/orders";

export const maxDuration = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // Siempre devolver 200 a Stripe para evitar que deshabilite el endpoint.
  // Los errores de configuración se loguean pero no causan reintentos de Stripe.
  if (!sig) {
    console.error("Webhook: falta stripe-signature header");
    return NextResponse.json({ received: true });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Webhook: STRIPE_WEBHOOK_SECRET no configurado en Vercel");
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    // Firma inválida = posible request fraudulento, sí devolver 400 aquí
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId) return NextResponse.json({ received: true });

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: "paid", stripe_session_id: session.id })
      .eq("order_id", orderId)
      .select()
      .single();

    if (error) {
      // Loguear pero devolver 200 — Stripe no debe reintentar por errores de DB
      console.error(`Webhook: Supabase error para orden ${orderId}:`, error);
      return NextResponse.json({ received: true });
    }

    try {
      await Promise.all([
        sendNewOrderToAdmin(order as Order),
        sendConfirmationToCustomer(order as Order),
      ]);
      console.log(`Emails enviados para orden ${orderId}`);
    } catch (emailErr) {
      console.error("Webhook: Email error para orden", orderId, ":", JSON.stringify(emailErr, Object.getOwnPropertyNames(emailErr)));
    }
  }

  return NextResponse.json({ received: true });
}
