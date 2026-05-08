import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendRetryPaymentEmail } from "@/lib/email";
import { Order } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending_payment")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const results: { orderId: string; email: string; success: boolean; error?: string }[] = [];

  for (const order of orders as Order[]) {
    try {
      await sendRetryPaymentEmail(order);
      results.push({ orderId: order.order_id, email: order.customer_email, success: true });
    } catch (err) {
      results.push({
        orderId: order.order_id,
        email: order.customer_email,
        success: false,
        error: String(err),
      });
    }
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({ sent, failed, results });
}
