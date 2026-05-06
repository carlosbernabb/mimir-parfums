import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { sendNewOrderToAdmin, sendConfirmationToCustomer } from "@/lib/email";
import { Order } from "@/lib/orders";

// Aumentar límite de tiempo en Vercel (máx 60s en plan Pro, 10s en Hobby)
export const maxDuration = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
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
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    try {
      await Promise.all([
        sendNewOrderToAdmin(order as Order),
        sendConfirmationToCustomer(order as Order),
      ]);
      console.log(`Emails enviados correctamente para orden ${orderId}`);
    } catch (emailErr) {
      // Error capturado — el webhook igual devuelve 200 para que Stripe no reintente
      console.error("Email error para orden", orderId, ":", JSON.stringify(emailErr, Object.getOwnPropertyNames(emailErr)));
    }
  }

  return NextResponse.json({ received: true });
}
