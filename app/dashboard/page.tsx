
import { getGroups } from "@/lib/radon";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getGroups();

  return (
    <DashboardClient
      groups={result.ok ? result.groups : []}
      error={result.ok ? null : result.error}
    />
  );
}
