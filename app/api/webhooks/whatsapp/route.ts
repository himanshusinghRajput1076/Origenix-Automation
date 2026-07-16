import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json();

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};

      for (const status of value.statuses ?? []) {
        const mapped =
          status.status === "delivered" ? "DELIVERED" :
          status.status === "read" ? "READ" :
          status.status === "failed" ? "FAILED" :
          "SENT";

        await db.delivery.updateMany({
          where: { providerId: status.id },
          data: {
            status: mapped,
            deliveredAt: ["delivered", "read"].includes(status.status) ? new Date() : undefined,
            errorMessage: status.errors?.[0]?.title ?? undefined
          }
        });
      }

      for (const message of value.messages ?? []) {
        const text = String(message.text?.body ?? "").trim().toLowerCase();
        if (["stop", "unsubscribe", "opt out", "cancel"].includes(text)) {
          const phone = `+${message.from}`;
          await db.contact.updateMany({
            where: { phoneE164: phone },
            data: { optedOut: true, optedOutAt: new Date() }
          });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
