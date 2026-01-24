import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Buat cookie kosong yang langsung expired
  const serializedCookie = serialize("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1, // Langsung expired
    path: "/",
  });

  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  response.headers.set("Set-Cookie", serializedCookie);

  return response;
}