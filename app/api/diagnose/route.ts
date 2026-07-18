import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, any> = {
    envKeysExist: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    },
    databaseConnection: "Not attempted",
  };

  if (process.env.DATABASE_URL) {
    // Redact password for safety
    diagnostics.databaseUrlMasked = process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@");
    
    try {
      const prisma = new PrismaClient();
      await prisma.$connect();
      // Try a simple query
      const userCount = await prisma.user.count();
      diagnostics.databaseConnection = "Success";
      diagnostics.userCount = userCount;
      await prisma.$disconnect();
    } catch (err: any) {
      diagnostics.databaseConnection = "Failed";
      diagnostics.databaseError = {
        message: err.message,
        code: err.code,
        meta: err.meta,
      };
    }
  } else {
    diagnostics.databaseConnection = "Skipped (no DATABASE_URL)";
  }

  return NextResponse.json(diagnostics);
}
