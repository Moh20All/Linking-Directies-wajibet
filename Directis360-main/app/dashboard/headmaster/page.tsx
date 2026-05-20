"use client";

import dynamic from "next/dynamic";

const HeadmasterDashboard = dynamic(
  () => import("@/components/dashboard/headmaster-dashboard"),
  { ssr: false }
);

export default function HeadmasterPage() {
  return <HeadmasterDashboard />;
}
