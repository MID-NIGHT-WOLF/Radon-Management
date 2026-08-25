
import Link from "next/link";
import type { RadonGroup } from "@/lib/types";

type Props = {
  groups: RadonGroup[];
  error: string | null;
};

export default function DashboardClient({
  groups,
  error
}: Props) {
  const totalMembers = groups.reduce(
    (total, group) =>
      total + (group.vrc_member_count || 0),
    0
  );

  const totalOnline = groups.reduce(
    (total, group) =>
      total + (group.vrc_online_members_count || 0),
    0
  );

  const verifiedGroups = groups.filter(
    group => group.vrc_is_verified
  ).length;

  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/dashboard" className="brand">
          <span className="brand-icon">R</span>
          Radon
        </Link>

        <span className="topbar-label">
          VRChat Moderation Dashboard
        </span>
      </header>

      <section className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Dashboard</h1>
            <p className="muted">
              Monitor the VRChat groups connected
              to your Radon account.
            </p>
          </div>

          <div className="status">
            <span />
            API Connected
          </div>
        </div>

        {error ? (
          <div className="error-card">
            <h2>Radon API Error</h2>
            <p>{error}</p>
            <small>
              Check your RADON_API_KEY in .env.local.
            </small>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <Stat title="Groups" value={groups.length} />
              <Stat title="Total Members" value={totalMembers} />
              <Stat title="Online Members" value={totalOnline} />
              <Stat title="Verified Groups" value={verifiedGroups} />
            </div>

            <div className="section-heading">
              <div>
                <p className="eyebrow">RADON API</p>
                <h2>Your Groups</h2>
              </div>

              <span className="muted small">
                {groups.length} groups
              </span>
            </div>

            {groups.length === 0 ? (
              <div className="empty-card">
                <h3>No groups found</h3>
                <p className="muted">
                  Your Radon API account does not
                  currently have access to any groups.
                </p>
              </div>
            ) : (
              <div className="group-grid">
                {groups.map(group => (
                  <Link
                    key={group.vrc_group_id}
                    href={`/dashboard/groups/${encodeURIComponent(
                      group.vrc_group_id
                    )}`}
                    className="group-card"
                  >
                    <div
                      className="group-banner"
                      style={
                        group.vrc_banner
                          ? {
                              backgroundImage:
                                `linear-gradient(180deg, transparent, rgba(5,7,12,.95)), url("${group.vrc_banner}")`
                            }
                          : undefined
                      }
                    >
                      <div className="group-icon">
                        {group.vrc_icon ? (
                          <img
                            src={group.vrc_icon}
                            alt=""
                          />
                        ) : (
                          group.vrc_short_name?.[0] || "G"
                        )}
                      </div>
                    </div>

                    <div className="group-body">
                      <div className="group-title">
                        <div>
                          <h3>{group.vrc_name}</h3>
                          <span>
                            {group.vrc_short_name ||
                              group.vrc_group_id}
                          </span>
                        </div>

                        <strong>→</strong>
                      </div>

                      <p>
                        {group.vrc_description ||
                          "No description available."}
                      </p>

                      <div className="group-meta">
                        <span>
                          {group.vrc_member_count || 0} members
                        </span>

                        <span>
                          {group.vrc_online_members_count || 0} online
                        </span>

                        {group.discord_server_name && (
                          <span>
                            Discord: {group.discord_server_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Stat({
  title,
  value
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value.toLocaleString()}</strong>
    </div>
  );
}
