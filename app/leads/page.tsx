import { db } from "@/lib/db";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const p = await searchParams;
  const where: any = {};
  if (p.country) where.country = { contains: p.country, mode: "insensitive" };
  if (p.type) where.type = p.type;
  if (p.status) where.status = p.status;
  const [leads, searches] = await Promise.all([
    db.lead.findMany({ where, orderBy: [{ score: "desc" }, { createdAt: "desc" }], take: 300 }),
    db.savedSearch.findMany({ orderBy: { createdAt: "desc" } })
  ]);
  return <main>
    <h1>Client & Tender Finder</h1>
    <p className="muted">Public sources only. Review every lead before outreach.</p>
    <div className="grid"><Link href="/searches/new"><button>Create saved search</button></Link>
      <form action="/api/discovery/run" method="post"><button>Scan configured sources now</button></form></div>
    <div className="card"><h2>Saved searches</h2>{searches.map(s => <div key={s.id}><strong>{s.name}</strong> — {s.query} <span className="muted">{s.lastRunAt ? `Last run ${s.lastRunAt.toLocaleString()}` : "Not run"}</span></div>)}</div>
    <div className="card"><h2>Discovered opportunities</h2><table><thead><tr><th>Score</th><th>Opportunity</th><th>Type</th><th>Country</th><th>Deadline</th><th>Status</th></tr></thead><tbody>
      {leads.map(l => <tr key={l.id}><td><strong>{l.score}</strong></td><td><a href={l.url} target="_blank" rel="noreferrer">{l.title}</a><div className="muted">{l.organization ?? "Unknown organization"}</div><div>{l.serviceTags.join(", ")}</div></td><td>{l.type}</td><td>{l.country ?? "—"}</td><td>{l.deadline?.toLocaleDateString() ?? "—"}</td><td>
        <form action={`/api/leads/${l.id}/status`} method="post"><select name="status" defaultValue={l.status}><option>NEW</option><option>REVIEWING</option><option>QUALIFIED</option><option>REJECTED</option><option>CONTACTED</option><option>WON</option><option>LOST</option><option>EXPIRED</option></select><button className="secondary">Update</button></form>
      </td></tr>)}
    </tbody></table></div>
  </main>;
}
