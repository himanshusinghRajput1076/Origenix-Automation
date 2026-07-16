import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { db } from "@/lib/db";
import { normalizePhoneE164 } from "@/lib/phone";
import { maxBatchSize } from "@/lib/safety";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "CSV file required" }, { status: 400 });

  const rows = parse(await file.text(), { columns: true, skip_empty_lines: true, trim: true });
  if (rows.length > maxBatchSize()) {
    return NextResponse.json({ error: `Maximum ${maxBatchSize()} contacts per upload` }, { status: 400 });
  }

  let imported = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    try {
      const phoneE164 = normalizePhoneE164(String(row.phone ?? ""));
      const consent = String(row.consent ?? "").toLowerCase() === "true";
      if (!consent) throw new Error("Explicit consent is required");
      const consentSource = String(row.consentSource ?? "").trim();
      if (!consentSource) throw new Error("consentSource is required");

      await db.contact.upsert({
        where: { phoneE164 },
        create: {
          phoneE164,
          name: row.name || null,
          consent: true,
          consentSource,
          consentAt: new Date()
        },
        update: {
          name: row.name || undefined,
          consent: true,
          consentSource,
          consentAt: new Date(),
          optedOut: false,
          optedOutAt: null
        }
      });
      imported++;
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  await db.auditLog.create({
    data: { action: "CONTACT_IMPORT", entityType: "Contact", metadata: { imported, errors } }
  });

  return NextResponse.redirect(new URL("/contacts", request.url), 303);
}
