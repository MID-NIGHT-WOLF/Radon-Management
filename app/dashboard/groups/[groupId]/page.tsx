import Link from "next/link";
import {
  getGroup,
  getModeratorStats
} from "@/lib/radon";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function GroupPage({
  params
}: Props) {
  const { groupId } = await params;

  const groupResult = await getGroup(groupId);

  if (!groupResult.ok) {
    return (
      <main className="shell">
        <Header />

        <section className="content">
          <Link href="/dashboard" className="back">
            ← Dashboard
          </Link>

          <div className="error-card">
            <h2>Could not load group</h2>
            <p>{groupResult.error}</p>
          </div>
        </section>
      </main>
    );
  }

  const group = groupResult.group;

  let moderatorResult = null;

  if (group.vrc_owner_id) {
    moderatorResult = await getModeratorStats(
      group.vrc_group_id,
      group.vrc_owner_id
    );
  }

  const stats =
    moderatorResult?.ok
      ? moderatorResult.stats
      : null;

  return (
    <main className="shell">
      <Header />

      <section className="content">
        <Link href="/dashboard" className="back">
          ← Dashboard
        </Link>

        <div className="group-hero">
          <div className="hero-icon">
            {group.vrc_icon ? (
              <img src={group.vrc_icon} alt="" />
            ) : (
              group.vrc_short_name?.[0] || "G"
            )}
          </div>

          <div>
            <p className="eyebrow">
              {group.vrc_short_name}
            </p>

            <h1>{group.vrc_name}</h1>

            <p className="muted description">
              {group.vrc_description ||
                "No description available."}
            </p>

            <div className="chips">
              <span>
                {group.vrc_member_count || 0} members
              </span>

              <span>
                {group.vrc_online_members_count || 0} online
              </span>

              <span>
                {group.vrc_join_state || "unknown"}
              </span>

              {group.vrc_is_verified && (
                <span>✓ Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">MODERATION</p>
            <h2>Moderator Statistics</h2>
          </div>
        </div>

        {stats ? (
          <>
            <div className="stats-grid">
              <Stat title="Total Actions" value={stats.total} />
              <Stat title="Marked" value={stats.marked} />
              <Stat title="Unmarked" value={stats.unmarked} />
              <Stat title="Action Ratio" value={`${stats.ratio}%`} />
              <Stat title="Warnings" value={stats.warns} />
              <Stat title="Kicks" value={stats.kicks} />
              <Stat title="Bans" value={stats.bans} />
              <Stat title="Moderator" value={stats.vrc_name} />
            </div>

            <div className="two-column">
              <InfoPanel
                title="Moderator"
                rows={[
                  ["VRChat", stats.vrc_name],
                  ["VRChat ID", stats.vrc_id],
                  ["Discord", stats.discord_name || "—"],
                  [
                    "Discord ID",
                    stats.discord_id?.toString() || "—"
                  ]
                ]}
              />

              <InfoPanel
                title="Discord"
                rows={[
                  [
                    "Server",
                    group.discord_server_name || "—"
                  ],
                  [
                    "Server ID",
                    group.discord_server_id?.toString() || "—"
                  ],
                  [
                    "Warn channel",
                    group.discord_warn_channel_id?.toString() || "—"
                  ],
                  [
                    "Kick channel",
                    group.discord_kick_channel_id?.toString() || "—"
                  ],
                  [
                    "Ban channel",
                    group.discord_ban_channel_id?.toString() || "—"
                  ]
                ]}
              />
            </div>
          </>
        ) : (
          <div className="error-card">
            <h3>Moderator statistics unavailable</h3>

            <p>
              {moderatorResult && !moderatorResult.ok
                ? moderatorResult.error
                : "This group has no owner ID."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="topbar">
      <Link href="/dashboard" className="brand">
        <span className="brand-icon">R</span>
        Radon
      </Link>

      <span className="topbar-label">
        VRChat Moderation Dashboard
      </span>
    </header>
  );
}

function Stat({
  title,
  value
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="stat-card">
      <span>{title}</span>

      <strong>
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </strong>
    </div>
  );
}

function InfoPanel({
  title,
  rows
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="panel">
      <h3>{title}</h3>

      {rows.map(([name, value]) => (
        <div className="info-row" key={name}>
          <span>{name}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  );
}
