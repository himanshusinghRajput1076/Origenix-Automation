import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  await db.contact.upsert({
    where: { phoneE164: "+919999999999" },
    create: {
      name: "Demo consented contact",
      phoneE164: "+919999999999",
      consent: true,
      consentSource: "Demo only",
      consentAt: new Date()
    },
    update: {}
  });
}

main().finally(() => db.$disconnect());
