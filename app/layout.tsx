import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, Building2, Briefcase, FileText, Send, Settings } from "lucide-react";

export const metadata = {
  title: "Origenix Growth CRM",
  description: "Full-stack CRM for Investor, Client, and Tender discovery with AI automation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card flex flex-col">
          <div className="h-14 flex items-center px-4 border-b font-bold text-lg">
            Origenix CRM
          </div>
          <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem href="/pipelines" icon={<Briefcase size={18} />} label="Pipelines" />
            <NavItem href="/contacts" icon={<Users size={18} />} label="Contacts" />
            <NavItem href="/companies" icon={<Building2 size={18} />} label="Companies" />
            <NavItem href="/investors" icon={<Building2 size={18} />} label="Investors" />
            <NavItem href="/tenders" icon={<FileText size={18} />} label="Tenders" />
            <NavItem href="/campaigns" icon={<Send size={18} />} label="Campaigns" />
          </nav>
          <div className="p-4 border-t">
            <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-muted/20">
          {children}
        </main>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors">
      {icon}
      {label}
    </Link>
  );
}
