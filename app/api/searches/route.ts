import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const query = String(form.get("query") ?? "").trim();
  const countries = String(form.get("countries") ?? "").split(",").map(v => v.trim()).filter(Boolean);
  const serviceTags = String(form.get("serviceTags") ?? "").split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
  if (!name || !query) return NextResponse.json({ error: "Name and query required" }, { status: 400 });
  await db.savedSearch.create({ data: { name, query, countries, serviceTags, startupFriendlyOnly: form.get("startupFriendlyOnly") === "on" } });
  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
