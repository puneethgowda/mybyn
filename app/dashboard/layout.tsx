import { MobileLayout } from "@/components/mobile-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout view="creator">{children}</MobileLayout>;
}
