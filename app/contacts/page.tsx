import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await db.contact.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <main>
      <h1>Contacts</h1>
      <div className="card">
        <h2>Upload CSV</h2>
        <p className="muted">Required headers: phone,name,consent,consentSource. Phone must be E.164. consent must be true.</p>
        <form action="/api/contacts/import" method="post" encType="multipart/form-data">
          <input type="file" name="file" accept=".csv,text/csv" required />
          <button type="submit">Import contacts</button>
        </form>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Consent</th><th>Opted out</th></tr></thead>
          <tbody>{contacts.map(c => (
            <tr key={c.id}><td>{c.name ?? "—"}</td><td>{c.phoneE164}</td><td>{c.consent ? "Yes" : "No"}</td><td>{c.optedOut ? "Yes" : "No"}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  );
}
