import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const { data, error } = await supabase
    .from("orders")
    .select("order_id,status,items,shipping,total_mxn,created_at,updated_at,customer_email")
    .eq("order_id", orderId.toUpperCase())
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Error al buscar el pedido" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });

  // Mask email partially for privacy
  const email = data.customer_email as string;
  const [user, domain] = email.split("@");
  const maskedEmail = `${user.slice(0, 2)}***@${domain}`;

  return NextResponse.json({ ...data, customer_email: maskedEmail });
}
