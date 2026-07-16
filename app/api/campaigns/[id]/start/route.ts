import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { placeVoiceCall } from "@/lib/twilio";
import { assertContactCanReceive, maxBatchSize, sleepForRateLimit } from "@/lib/safety";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await db.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const contacts = await db.contact.findMany({
    where: { consent: true, optedOut: false },
    take: maxBatchSize(),
    orderBy: { createdAt: "asc" }
  });

  await db.campaign.update({
    where: { id },
    data: { status: "RUNNING", startedAt: new Date() }
  });

  for (const contact of contacts) {
    const delivery = await db.delivery.upsert({
      where: { campaignId_contactId: { campaignId: id, contactId: contact.id } },
      create: { campaignId: id, contactId: contact.id },
      update: {}
    });

    if (delivery.status !== "QUEUED") continue;

    try {
      await assertContactCanReceive(contact.id);

      if (campaign.channel === "WHATSAPP") {
        const result = await sendWhatsAppTemplate({
          to: contact.phoneE164,
          templateName: campaign.templateName!,
          languageCode: campaign.templateLanguage ?? "en",
          variables: Array.isArray(campaign.templateVariables)
            ? campaign.templateVariables.map(String)
            : []
        });
        await db.delivery.update({
          where: { id: delivery.id },
          data: { status: "SENT", providerId: result.messages?.[0]?.id, sentAt: new Date() }
        });
      } else {
        const call = await placeVoiceCall({ to: contact.phoneE164, deliveryId: delivery.id });
        await db.delivery.update({
          where: { id: delivery.id },
          data: { status: "SENT", providerId: call.sid, sentAt: new Date() }
        });
      }
    } catch (error) {
      await db.delivery.update({
        where: { id: delivery.id },
        data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "Unknown error" }
      });
    }

    await sleepForRateLimit();
  }

  await db.campaign.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() }
  });

  return NextResponse.redirect(new URL(`/campaigns/${id}`, request.url), 303);
}
