"use client";

import { useState } from "react";
import { CheckCircle2, Zap } from "lucide-react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // In a real app, we'd get the actual logged in user's email
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + data.error);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">Manage your plan and billing history.</p>
      </div>

      <div className="bg-card border rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Current Plan: <span className="bg-muted px-3 py-1 rounded-full text-sm font-semibold uppercase">Free Tier</span>
            </h2>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              100 AI Lead Qualifications / month
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Basic WhatsApp Outreach
            </li>
            <li className="flex items-center gap-3 text-muted-foreground opacity-50">
              <span className="w-5 h-5 flex items-center justify-center border-2 rounded-full border-muted-foreground/30"></span>
              Unlimited Automated Voice Calls
            </li>
            <li className="flex items-center gap-3 text-muted-foreground opacity-50">
              <span className="w-5 h-5 flex items-center justify-center border-2 rounded-full border-muted-foreground/30"></span>
              Dedicated Support Agent
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center max-w-sm">
          <div className="p-3 bg-white/10 rounded-full mb-4 ring-1 ring-black/5 dark:ring-white/10">
            <Zap className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
          <p className="text-muted-foreground text-sm mb-6">Unlock unlimited AI qualifications, voice calling, and priority support.</p>
          <div className="text-3xl font-bold mb-6">$49 <span className="text-lg font-normal text-muted-foreground">/mo</span></div>
          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-3 transition-all flex justify-center items-center gap-2"
          >
            {loading ? "Preparing..." : "Upgrade Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
