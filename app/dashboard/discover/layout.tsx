import React from "react";

import { FilterPanelProvider } from "@/components/dashboard/filter-panel";

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FilterPanelProvider>{children}</FilterPanelProvider>;
}
