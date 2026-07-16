import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const status = String(form.get("status") ?? "NEW") as any;
  await db.lead.update({ where: { id }, data: { status } });
  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
