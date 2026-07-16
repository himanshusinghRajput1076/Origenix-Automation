import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await db.campaign.findUnique({
    where: { id },
    include: { deliveries: { include: { contact: true }, orderBy: { createdAt: "desc" }, take: 500 } }
  });
  if (!campaign) notFound();

  return (
    <main>
      <h1>{campaign.name}</h1>
      <div className="card">
        <p>Channel: {campaign.channel}</p>
        <p>Status: <span className="badge">{campaign.status}</span></p>
        <form action={`/api/campaigns/${campaign.id}/start`} method="post">
          <button type="submit">Start campaign for all eligible contacts</button>
        </form>
      </div>
      <div className="card">
        <h2>Deliveries</h2>
        <table>
          <thead><tr><th>Contact</th><th>Phone</th><th>Status</th><th>Error</th></tr></thead>
          <tbody>{campaign.deliveries.map(d => (
            <tr key={d.id}><td>{d.contact.name ?? "—"}</td><td>{d.contact.phoneE164}</td><td>{d.status}</td><td>{d.errorMessage ?? "—"}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
}
