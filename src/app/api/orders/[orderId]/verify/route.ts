import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { sendNewOrderToAdmin, sendConfirmationToCustomer } from "@/lib/email";
import { Order } from "@/lib/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId.toUpperCase())
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  // Already paid — nothing to do
  if (order.status !== "pending_payment") {
    return NextResponse.json({ status: order.status });
  }

  // Verify directly with Stripe
  if (!order.stripe_session_id) {
    return NextResponse.json({ status: order.status });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);

    if (session.payment_status === "paid") {
      const { data: updated } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("order_id", orderId.toUpperCase())
        .select()
        .single();

      if (updated) {
        try {
          await Promise.all([
            sendNewOrderToAdmin(updated as Order),
            sendConfirmationToCustomer(updated as Order),
          ]);
        } catch (e) {
          console.error("Email error:", e);
        }
      }

      return NextResponse.json({ status: "paid" });
    }
  } catch (e) {
    console.error("Stripe verify error:", e);
  }

  return NextResponse.json({ status: order.status });
}
