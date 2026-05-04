import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function checkAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("Authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: "Error al cargar pedidos" }, { status: 500 });

  return NextResponse.json({ orders: data });
}
