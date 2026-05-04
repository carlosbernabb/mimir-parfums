import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendStatusUpdateToCustomer } from "@/lib/email";
import { Order } from "@/lib/orders";

function checkAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("Authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { orderId } = await params;
  const { status, notes, tracking_number, carrier, tracking_url } = await req.json();

  const validStatuses = ["paid", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const updateData: Record<string, string> = { status };
  if (notes !== undefined) updateData.notes = notes;
  if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
  if (carrier !== undefined) updateData.carrier = carrier;
  if (tracking_url !== undefined) updateData.tracking_url = tracking_url;

  const { data: order, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("order_id", orderId.toUpperCase())
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });

  try {
    await sendStatusUpdateToCustomer(order as Order, status);
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ success: true, order });
}
