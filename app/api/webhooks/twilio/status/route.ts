import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const sid = String(form.get("CallSid") ?? "");
  const status = String(form.get("CallStatus") ?? "");

  const mapped =
    status === "completed" ? "ANSWERED" :
    ["busy", "failed", "no-answer", "canceled"].includes(status) ? "FAILED" :
    "SENT";

  if (sid) {
    await db.delivery.updateMany({
      where: { providerId: sid },
      data: { status: mapped, deliveredAt: status === "completed" ? new Date() : undefined }
    });
  }

  return NextResponse.json({ ok: true });
}
