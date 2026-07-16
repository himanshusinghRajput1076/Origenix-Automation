import { db } from "@/lib/db";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";
import DashboardCharts from "./charts"; // We will create this client component

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [contacts, companies, investors, deals] = await Promise.all([
    db.contact.count(),
    db.company.count(),
    db.investor.count(),
    db.deal.count()
  ]);
  
  // Dummy data for charts
  const chartData = [
    { name: "Jan", leads: 40, qualified: 24 },
    { name: "Feb", leads: 30, qualified: 13 },
    { name: "Mar", leads: 20, qualified: 98 },
    { name: "Apr", leads: 27, qualified: 39 },
    { name: "May", leads: 18, qualified: 48 },
    { name: "Jun", leads: 23, qualified: 38 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Contacts" value={contacts} icon={<Users className="text-blue-500" />} />
        <StatCard title="Companies" value={companies} icon={<Building2 className="text-emerald-500" />} />
        <StatCard title="Investors" value={investors} icon={<Building2 className="text-amber-500" />} />
        <StatCard title="Active Deals" value={deals} icon={<Briefcase className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
          <div className="flex-1 min-h-[300px]">
            <DashboardCharts data={chartData} />
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
             <div className="text-sm text-muted-foreground flex items-center gap-3 py-2 border-b">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               AI qualified 3 new leads from SAM.gov
             </div>
             <div className="text-sm text-muted-foreground flex items-center gap-3 py-2 border-b">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               WhatsApp Campaign "Founders Q3" finished sending
             </div>
             <div className="text-sm text-muted-foreground flex items-center gap-3 py-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               New deal moved to Negotiation
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-muted rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
