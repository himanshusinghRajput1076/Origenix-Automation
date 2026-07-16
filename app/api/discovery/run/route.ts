import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/discovery/run";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.DISCOVERY_CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await runDiscovery());
}

export async function GET(request: Request) { return POST(request); }
