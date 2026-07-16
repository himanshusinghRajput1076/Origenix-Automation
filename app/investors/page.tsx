import { db } from "@/lib/db";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  const investors = await db.investor.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Investors</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus size={16} /> Add Investor
        </button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Focus</th>
              <th className="px-6 py-3 font-medium">Cheque Size</th>
              <th className="px-6 py-3 font-medium">Geography</th>
              <th className="px-6 py-3 font-medium">LinkedIn</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y border-t">
            {investors.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No investors found.</td></tr>
            ) : (
              investors.map(inv => (
                <tr key={inv.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{inv.name}</td>
                  <td className="px-6 py-4">{inv.focus || '-'}</td>
                  <td className="px-6 py-4">{inv.chequeSize || '-'}</td>
                  <td className="px-6 py-4">{inv.geography || '-'}</td>
                  <td className="px-6 py-4">{inv.linkedin ? <a href={inv.linkedin} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">View</a> : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
