import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { token } = body;

  console.log("Received token:", token);
  // TODO: Save token to your database

  return NextResponse.json({ success: true });
}
