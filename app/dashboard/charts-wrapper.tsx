"use client";

import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("./charts"), { ssr: false });

export default function ChartsWrapper({ data }: { data: any[] }) {
  return <DashboardCharts data={data} />;
}
