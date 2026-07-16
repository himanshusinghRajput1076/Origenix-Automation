import type { DiscoveredLead } from "./types";

const SERVICE_TERMS: Record<string, string[]> = {
  website: ["website", "web development", "web portal", "wordpress", "web redesign"],
  mobile: ["mobile app", "android", "ios", "application development"],
  ai: ["artificial intelligence", "machine learning", "generative ai", "chatbot", "llm"],
  cybersecurity: ["cybersecurity", "security audit", "penetration testing", "soc", "vulnerability"],
  cloud: ["cloud", "devops", "aws", "azure", "gcp", "migration"],
  saas: ["saas", "software platform", "custom software", "software development"],
  automation: ["automation", "digital transformation", "workflow", "rpa"]
};

export function inferTags(text: string): string[] {
  const value = text.toLowerCase();
  return Object.entries(SERVICE_TERMS)
    .filter(([, terms]) => terms.some(term => value.includes(term)))
    .map(([tag]) => tag);
}

export function scoreLead(lead: DiscoveredLead) {
  let score = 0;
  const reasons: string[] = [];
  const text = `${lead.title} ${lead.description ?? ""}`.toLowerCase();

  if (lead.serviceTags.length) { score += Math.min(35, lead.serviceTags.length * 8); reasons.push("Matches Origenix services"); }
  if (lead.deadline && lead.deadline > new Date()) { score += 15; reasons.push("Open future deadline"); }
  if (lead.budgetMax && lead.budgetMax <= 30000) { score += 15; reasons.push("Small-project budget range"); }
  if (/startup|sme|small business|msme|mittelstand/.test(text)) { score += 10; reasons.push("Startup/SME friendly"); }
  if (lead.contactEmail || lead.contactPhone) { score += 10; reasons.push("Direct public contact available"); }
  if (/remote|offshore|international|global/.test(text)) { score += 10; reasons.push("Remote/international delivery indicated"); }
  if (/framework|enterprise-wide|nationwide|multi-year/.test(text)) { score -= 10; reasons.push("Potentially enterprise-scale"); }
  if (lead.deadline && lead.deadline < new Date()) { score -= 50; reasons.push("Deadline appears expired"); }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}
