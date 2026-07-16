import { db } from "@/lib/db";
import { fingerprint, searchGoogleWeb, searchSamGov, searchTed } from "./providers";
import { scoreLead } from "./scoring";
import type { DiscoveredLead } from "./types";

export async function runDiscovery() {
  const searches = await db.savedSearch.findMany({ where: { enabled: true } });
  let found = 0, inserted = 0;
  const errors: string[] = [];

  for (const search of searches) {
    const batches: DiscoveredLead[][] = [];
    try { batches.push(await searchGoogleWeb(search.query, search.countries)); } catch (e) { errors.push(String(e)); }
    try { batches.push(await searchSamGov(search.query)); } catch (e) { errors.push(String(e)); }
    try { batches.push(await searchTed(search.query)); } catch (e) { errors.push(String(e)); }

    for (const lead of batches.flat()) {
      found++;
      if (!lead.url || !lead.title) continue;
      if (search.serviceTags.length && !lead.serviceTags.some(t => search.serviceTags.includes(t))) continue;
      const scored = scoreLead(lead);
      if (search.startupFriendlyOnly && scored.score < 20) continue;
      const fp = fingerprint(lead.url, lead.title);
      try {
        await db.lead.upsert({
          where: { fingerprint: fp },
          create: { ...lead, fingerprint: fp, score: scored.score, scoreReasons: scored.reasons, raw: lead.raw as any },
          update: { description: lead.description, deadline: lead.deadline, score: scored.score, scoreReasons: scored.reasons, raw: lead.raw as any }
        });
        inserted++;
      } catch (e) { errors.push(String(e)); }
    }
    await db.savedSearch.update({ where: { id: search.id }, data: { lastRunAt: new Date() } });
  }
  await db.auditLog.create({ data: { action: "DISCOVERY_RUN", entityType: "Lead", metadata: { found, inserted, errors } } });
  return { found, inserted, errors };
}
