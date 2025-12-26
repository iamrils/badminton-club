import { NextResponse } from "next/server";
import { getRecords } from "@/lib/sheets";

export async function GET() {
  const records = await getRecords();
  return NextResponse.json(records);
}
