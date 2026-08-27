import { getModeratorStats } from "@/lib/radon";

export async function GET(
  _request: Request,
  {
    params
  }: {
    params: Promise<{
      groupId: string;
      userId: string;
    }>;
  }
) {
  const { groupId, userId } =
    await params;

  const result =
    await getModeratorStats(
      groupId,
      userId
    );

  if (!result.ok) {
    return Response.json(
      {
        error: result.error
      },
      {
        status: result.status || 500
      }
    );
  }

  return Response.json({
    stats: result.stats
  });
}