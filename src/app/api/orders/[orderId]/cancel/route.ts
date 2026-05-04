import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendStatusUpdateToCustomer } from "@/lib/email";
import { canCancel, Order } from "@/lib/orders";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId.toUpperCase())
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (!canCancel(order.status)) {
    return NextResponse.json(
      { error: "Este pedido ya no puede ser cancelado" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("order_id", orderId.toUpperCase());

  if (updateError) {
    return NextResponse.json({ error: "Error al cancelar" }, { status: 500 });
  }

  try {
    await sendStatusUpdateToCustomer({ ...order, status: "cancelled" } as Order, "cancelled");
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ success: true });
}
