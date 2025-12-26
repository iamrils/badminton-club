import { NextResponse } from "next/server";
import { getTotalValue } from "@/lib/sheets";

export async function GET() {
  const total = await getTotalValue();
  return NextResponse.json({ total });
}
