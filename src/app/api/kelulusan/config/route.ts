import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConfigKelulusan from "@/models/ConfigKelulusan";

export async function GET(req: Request) {
  await connectDB();
  let config = await ConfigKelulusan.findOne();
  if (!config) {
    config = await ConfigKelulusan.create({}); // Create default jika belum ada
  }
  return NextResponse.json({ success: true, data: config });
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();
  
  // Update atau Insert (Upsert)
  const config = await ConfigKelulusan.findOneAndUpdate({}, body, { new: true, upsert: true });
  
  return NextResponse.json({ success: true, data: config });
}