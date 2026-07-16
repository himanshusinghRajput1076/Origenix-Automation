import crypto from "node:crypto";
import type { DiscoveredLead } from "./types";
import { inferTags } from "./scoring";

export function fingerprint(url: string, title: string) {
  return crypto.createHash("sha256").update(`${url.trim().toLowerCase()}|${title.trim().toLowerCase()}`).digest("hex");
}

export async function searchGoogleWeb(query: string, countries: string[]): Promise<DiscoveredLead[]> {
  const key = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (!key || !cx) return [];
  const geo = countries.length ? ` (${countries.join(" OR ")})` : "";
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", key); url.searchParams.set("cx", cx); url.searchParams.set("q", query + geo); url.searchParams.set("num", "10");
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Google search failed: ${response.status}`);
  const data = await response.json();
  return (data.items ?? []).map((item: any) => {
    const text = `${item.title ?? ""} ${item.snippet ?? ""}`;
    const tender = /tender|rfp|eoi|quotation|procurement|bid/i.test(text);
    return {
      type: tender ? "TENDER" : "CLIENT",
      title: item.title ?? "Untitled opportunity",
      url: item.link,
      description: item.snippet,
      serviceTags: inferTags(text),
      raw: item
    } satisfies DiscoveredLead;
  });
}

export async function searchSamGov(query: string): Promise<DiscoveredLead[]> {
  const key = process.env.SAM_GOV_API_KEY;
  if (!key) return [];
  const now = new Date();
  const from = new Date(now.getTime() - 30 * 86400000);
  const fmt = (d: Date) => `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`;
  const url = new URL("https://api.sam.gov/opportunities/v2/search");
  url.searchParams.set("api_key", key); url.searchParams.set("limit", "25"); url.searchParams.set("postedFrom", fmt(from)); url.searchParams.set("postedTo", fmt(now)); url.searchParams.set("keyword", query);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`SAM.gov failed: ${response.status}`);
  const data = await response.json();
  return (data.opportunitiesData ?? []).map((o: any) => {
    const text = `${o.title ?? ""} ${o.description ?? ""}`;
    return {
      externalId: o.noticeId,
      type: "TENDER",
      title: o.title,
      organization: o.fullParentPathName,
      country: "United States",
      url: o.uiLink ?? `https://sam.gov/opp/${o.noticeId}/view`,
      description: o.description,
      publishedAt: o.postedDate ? new Date(o.postedDate) : undefined,
      deadline: o.responseDeadLine ? new Date(o.responseDeadLine) : undefined,
      contactEmail: o.pointOfContact?.[0]?.email,
      contactPhone: o.pointOfContact?.[0]?.phone,
      serviceTags: inferTags(text), raw: o
    } satisfies DiscoveredLead;
  });
}

export async function searchTed(query: string): Promise<DiscoveredLead[]> {
  const response = await fetch("https://api.ted.europa.eu/v3/notices/search", {
    method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify({ query, page: 1, limit: 25, fields: ["notice-title", "publication-number", "publication-date", "deadline-receipt-tender-date-lot", "buyer-name", "place-of-performance-country-lot"] })
  });
  if (!response.ok) return [];
  const data = await response.json();
  return (data.notices ?? []).map((n: any) => {
    const title = n["notice-title"]?.eng ?? n["notice-title"] ?? "EU procurement opportunity";
    return {
      externalId: n["publication-number"], type: "TENDER", title,
      organization: Array.isArray(n["buyer-name"]) ? n["buyer-name"][0] : n["buyer-name"],
      country: Array.isArray(n["place-of-performance-country-lot"]) ? n["place-of-performance-country-lot"][0] : undefined,
      url: `https://ted.europa.eu/en/notice/-/detail/${n["publication-number"]}`,
      publishedAt: n["publication-date"] ? new Date(n["publication-date"]) : undefined,
      deadline: Array.isArray(n["deadline-receipt-tender-date-lot"]) && n["deadline-receipt-tender-date-lot"][0] ? new Date(n["deadline-receipt-tender-date-lot"][0]) : undefined,
      serviceTags: inferTags(title), raw: n
    } satisfies DiscoveredLead;
  });
}
