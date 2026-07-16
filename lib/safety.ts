import { db } from "@/lib/db";

export async function assertContactCanReceive(contactId: string) {
  const contact = await db.contact.findUnique({ where: { id: contactId } });
  if (!contact) throw new Error("Contact not found");
  if (!contact.consent) throw new Error("No recorded consent");
  if (contact.optedOut) throw new Error("Contact opted out");
  return contact;
}

export function maxBatchSize() {
  return Math.max(1, Number(process.env.MAX_BATCH_SIZE ?? "100"));
}

export async function sleepForRateLimit() {
  const perMinute = Math.max(1, Number(process.env.CAMPAIGN_RATE_PER_MINUTE ?? "20"));
  await new Promise(resolve => setTimeout(resolve, Math.ceil(60000 / perMinute)));
}
