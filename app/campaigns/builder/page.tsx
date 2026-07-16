import { Send, Phone, Mail, Clock, Play, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CampaignBuilderPage() {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Automation Builder</h1>
          <p className="text-muted-foreground mt-1">Design your WhatsApp, Email, and Voice outreach workflows.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <Play size={16} /> Save & Activate
        </button>
      </div>

      <div className="flex-1 flex bg-card border rounded-xl overflow-hidden shadow-sm">
        {/* Toolbox */}
        <div className="w-64 border-r bg-muted/20 p-4">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Triggers</h3>
          <div className="space-y-2 mb-8">
            <ToolboxItem icon={<Users size={16} />} label="New Lead Matched" />
            <ToolboxItem icon={<Send size={16} />} label="Form Submitted" />
          </div>

          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Actions</h3>
          <div className="space-y-2">
            <ToolboxItem icon={<Phone size={16} />} label="Automated Call" />
            <ToolboxItem icon={<Send size={16} />} label="WhatsApp Message" />
            <ToolboxItem icon={<Mail size={16} />} label="Send Email" />
            <ToolboxItem icon={<Clock size={16} />} label="Delay" />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted/10 relative overflow-auto p-8">
          <div className="absolute inset-0 pattern-dots text-muted-foreground/20" style={{ backgroundSize: '24px 24px', backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)' }} />
          
          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
            {/* Example Flow */}
            <FlowNode label="Trigger: New Investor Matched" type="trigger" />
            <FlowArrow />
            <FlowNode label="WhatsApp: Pitch Deck Intro" type="action" />
            <FlowArrow />
            <FlowNode label="Delay: 2 days" type="delay" />
            <FlowArrow />
            <div className="flex gap-12 relative w-full justify-center">
               <div className="absolute top-[-16px] left-1/2 w-1/2 border-t-2 border-l-2 border-r-2 h-4 -translate-x-1/2" />
               <FlowNode label="If Read: Book Call" type="condition" />
               <FlowNode label="If Ignored: Send Email" type="condition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolboxItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card border rounded-md cursor-grab hover:border-primary/50 hover:shadow-sm transition-all text-sm font-medium">
      {icon}
      {label}
    </div>
  );
}

function FlowNode({ label, type }: { label: string; type: 'trigger' | 'action' | 'delay' | 'condition' }) {
  const colors = {
    trigger: "border-blue-200 bg-blue-50 text-blue-900",
    action: "border-green-200 bg-green-50 text-green-900",
    delay: "border-amber-200 bg-amber-50 text-amber-900",
    condition: "border-purple-200 bg-purple-50 text-purple-900"
  };
  
  return (
    <div className={`px-6 py-3 border-2 rounded-lg font-medium shadow-sm w-64 text-center ${colors[type]}`}>
      {label}
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="h-8 w-0.5 bg-border flex flex-col items-center justify-end relative">
      <div className="w-2 h-2 border-r-2 border-b-2 border-border rotate-45 absolute -bottom-1 bg-muted/10" />
    </div>
  );
}
