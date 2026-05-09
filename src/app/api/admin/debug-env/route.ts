import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = process.env.RESEND_API_KEY;
  return NextResponse.json({
    resend_key_exists: !!key,
    resend_key_length: key?.length ?? 0,
    resend_key_prefix: key?.slice(0, 6) ?? "(empty)",
    anthropic_key_exists: !!process.env.ANTHROPIC_API_KEY,
    anthropic_key_prefix: process.env.ANTHROPIC_API_KEY?.slice(0, 10) ?? "(empty)",
  });
}
