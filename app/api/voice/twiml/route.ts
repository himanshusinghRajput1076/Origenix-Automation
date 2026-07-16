import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import twilio from "twilio";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const deliveryId = url.searchParams.get("deliveryId");
  const delivery = deliveryId
    ? await db.delivery.findUnique({ where: { id: deliveryId }, include: { campaign: true } })
    : null;

  const response = new twilio.twiml.VoiceResponse();
  response.say({ voice: "alice" }, delivery?.campaign.voiceMessage ?? "This is an automated notification.");
  response.pause({ length: 1 });
  response.say({ voice: "alice" }, "To stop future automated calls, please contact the sender or use the opt out link provided.");

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" }
  });
}

export async function GET(request: Request) {
  return POST(request);
}
