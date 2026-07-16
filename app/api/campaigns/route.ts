import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3).max(120),
  channel: z.enum(["WHATSAPP", "VOICE"]),
  templateName: z.string().optional(),
  templateLanguage: z.string().optional(),
  templateVariables: z.string().optional(),
  voiceMessage: z.string().optional()
});

export async function POST(request: Request) {
  const form = Object.fromEntries((await request.formData()).entries());
  const data = schema.parse(form);

  if (data.channel === "WHATSAPP" && !data.templateName) {
    return NextResponse.json({ error: "Approved WhatsApp template name required" }, { status: 400 });
  }
  if (data.channel === "VOICE" && !data.voiceMessage) {
    return NextResponse.json({ error: "Voice message required" }, { status: 400 });
  }

  const campaign = await db.campaign.create({
    data: {
      name: data.name,
      channel: data.channel,
      templateName: data.templateName || null,
      templateLanguage: data.templateLanguage || "en",
      templateVariables: data.templateVariables
        ? data.templateVariables.split(",").map(v => v.trim()).filter(Boolean)
        : [],
      voiceMessage: data.voiceMessage || null
    }
  });

  return NextResponse.redirect(new URL(`/campaigns/${campaign.id}`, request.url), 303);
}
