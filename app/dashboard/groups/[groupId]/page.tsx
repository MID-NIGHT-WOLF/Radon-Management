import {
  getGroup,
  getLogs
} from "@/lib/radon";

import GroupDashboardClient from "@/components/GroupDashboardClient";

export const dynamic = "force-dynamic";

export default async function GroupDashboardPage({
  params
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const [groupResult, logsResult] =
    await Promise.all([
      getGroup(groupId),
      getLogs(groupId, 1, 20)
    ]);

  return (
    <GroupDashboardClient
      group={
        groupResult.ok
          ? groupResult.group
          : null
      }
      logs={
        logsResult.ok
          ? logsResult.logs
          : []
      }
      error={
        groupResult.ok
          ? logsResult.ok
            ? null
            : logsResult.error
          : groupResult.error
      }
    />
  );
}