"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { RadonGroup } from "@/lib/types";
import type { RadonAuditLog } from "@/lib/radon";

type Props = {
  group: RadonGroup | null;
  logs: RadonAuditLog[];
  error: string | null;
};

type Moderator = {
  vrc_id: string;
  vrc_name: string;
  total: number;
  ratio: number;
};

const ACTION_NAMES: Record<number, string> = {
  1: "Warn",
  2: "Kick",
  4: "Ban",
  8: "Unban",
  16: "Instance Open",
  32: "Instance Close"
};

export default function GroupDashboardClient({
  group,
  logs,
  error
}: Props) {
  const [bioExpanded, setBioExpanded] =
    useState(false);

  const [moderators, setModerators] =
    useState<Moderator[]>([]);

  const [loadingModerators, setLoadingModerators] =
    useState(true);

  useEffect(() => {
    if (!group) return;

    const ids = Array.from(
      new Set(
        logs
          .map(log => log.moderator)
          .filter(
            (id): id is string =>
              Boolean(id)
          )
      )
    );

    if (ids.length === 0) {
      setModerators([]);
      setLoadingModerators(false);
      return;
    }

    async function loadModerators() {
      setLoadingModerators(true);

      const results =
        await Promise.all(
          ids.map(async id => {
            try {
              const response =
                await fetch(
                  `/api/groups/${encodeURIComponent(
                    group.vrc_group_id
                  )}/statistics/moderators/${encodeURIComponent(
                    id
                  )}`
                );

              if (!response.ok) {
                return null;
              }

              const data =
                await response.json();

              return data.stats as Moderator;
            } catch {
              return null;
            }
          })
        );

      setModerators(
        results.filter(
          (item): item is Moderator =>
            item !== null
        )
      );

      setLoadingModerators(false);
    }

    loadModerators();
  }, [group, logs]);

  if (error || !group) {
    return (
      <main className="shell">
        <header className="topbar">
          <Link
            href="/dashboard"
            className="brand"
          >
            <span className="brand-icon">
              R
            </span>
            Radon
          </Link>

          <span className="topbar-label">
            VRChat Moderation Dashboard
          </span>
        </header>

        <section className="content">
          <div className="error-card">
            <h2>Could not load group</h2>

            <p>
              {error ||
                "The requested group could not be found."}
            </p>

            <Link
              href="/dashboard"
              className="back-link"
            >
              ← Back to groups
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const description =
    group.vrc_description ||
    "No description available.";

  const shouldCollapse =
    description.length > 280;

  const visibleDescription =
    bioExpanded || !shouldCollapse
      ? description
      : `${description
          .slice(0, 280)
          .trimEnd()}...`;

  const instanceOpens = logs.filter(
    log => log.action === 16
  ).length;

  const topByActions = [...moderators]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topByRatio = [...moderators]
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 5);

  return (
    <main className="shell">
      <header className="topbar">
        <Link
          href="/dashboard"
          className="brand"
        >
          <span className="brand-icon">
            R
          </span>
          Radon
        </Link>

        <span className="topbar-label">
          VRChat Moderation Dashboard
        </span>
      </header>

      <section className="content">
        <Link
          href="/dashboard"
          className="back-link"
        >
          ← All groups
        </Link>

        {/* GROUP HEADER */}

        <section className="group-dashboard-header">
          <div
            className="group-dashboard-banner"
            style={
              group.vrc_banner
                ? {
                    backgroundImage:
                      `linear-gradient(
                        180deg,
                        transparent 20%,
                        rgba(5,7,12,.95) 100%
                      ), url("${group.vrc_banner}")`
                  }
                : undefined
            }
          />

          <div className="group-dashboard-info">
            <div className="group-dashboard-icon">
              {group.vrc_icon ? (
                <img
                  src={group.vrc_icon}
                  alt=""
                />
              ) : (
                group.vrc_short_name?.[0] ||
                "G"
              )}
            </div>

            <div className="group-dashboard-title">
              <div className="group-name-row">
                <div>
                  <p className="eyebrow">
                    GROUP DASHBOARD
                  </p>

                  <h1>{group.vrc_name}</h1>

                  <span className="group-short-name">
                    {group.vrc_short_name ||
                      group.vrc_group_id}
                  </span>
                </div>

                {group.vrc_is_verified && (
                  <span className="verified-badge">
                    Verified
                  </span>
                )}
              </div>

              <div className="group-bio">
                <p>
                  {visibleDescription}
                </p>

                {shouldCollapse && (
                  <button
                    type="button"
                    className="view-more"
                    onClick={() =>
                      setBioExpanded(
                        current => !current
                      )
                    }
                  >
                    {bioExpanded
                      ? "View less"
                      : "View more"}
                  </button>
                )}
              </div>

              <div className="group-meta">
                <span>
                  {(
                    group.vrc_member_count ||
                    0
                  ).toLocaleString()}{" "}
                  members
                </span>

                <span>
                  {(
                    group.vrc_online_members_count ||
                    0
                  ).toLocaleString()}{" "}
                  online
                </span>

                <span>
                  {group.vrc_join_state ||
                    "unknown"}
                </span>

                {group.discord_server_name && (
                  <span>
                    Discord:{" "}
                    {group.discord_server_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS */}

        <div className="section-heading dashboard-section-heading">
          <div>
            <p className="eyebrow">
              STATISTICS
            </p>

            <h2>Group overview</h2>
          </div>
        </div>

        <div className="stats-grid dashboard-stats">
          <DashboardStat
            title="Logs Loaded"
            value={logs.length.toLocaleString()}
            description="Latest audit logs"
          />

          <DashboardStat
            title="Action Ratio"
            value={
              topByRatio.length
                ? `${averageRatio(
                    moderators
                  ).toFixed(1)}%`
                : "—"
            }
            description="Moderator action ratio"
          />

          <DashboardStat
            title="Instance Opens"
            value={instanceOpens.toLocaleString()}
            description="In the loaded logs"
          />

          <DashboardStat
            title="Members"
            value={(
              group.vrc_member_count ||
              0
            ).toLocaleString()}
            description="Current group members"
          />
        </div>

        {/* MODERATOR CHARTS */}

        <div className="dashboard-chart-grid">
          <ModeratorChart
            title="Top moderators by actions"
            moderators={topByActions}
            valueKey="total"
            loading={loadingModerators}
            suffix=""
          />

          <ModeratorChart
            title="Top moderators by ratio"
            moderators={topByRatio}
            valueKey="ratio"
            loading={loadingModerators}
            suffix="%"
          />
        </div>

        {/* RECENT LOGS */}

        <section className="dashboard-panel recent-logs-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                AUDIT LOG
              </p>

              <h2>Recent audit logs</h2>
            </div>

            <span className="muted small">
              {logs.length} loaded
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="empty-logs">
              <div className="empty-logs-icon">
                ◷
              </div>

              <h3>No audit logs found</h3>

              <p className="muted">
                This group has no logs available
                from the Radon API.
              </p>
            </div>
          ) : (
            <div className="audit-log-list">
              {logs.map(log => (
                <AuditLogRow
                  key={log.id}
                  log={log}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function DashboardStat({
  title,
  value,
  description
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="stat-card dashboard-stat">
      <span>{title}</span>

      <strong>{value}</strong>

      <small>{description}</small>
    </div>
  );
}

function ModeratorChart({
  title,
  moderators,
  valueKey,
  loading,
  suffix
}: {
  title: string;
  moderators: Moderator[];
  valueKey: "total" | "ratio";
  loading: boolean;
  suffix: string;
}) {
  const max =
    moderators.length > 0
      ? Math.max(
          ...moderators.map(
            moderator =>
              moderator[valueKey]
          )
        )
      : 0;

  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">
            MODERATION
          </p>

          <h2>{title}</h2>
        </div>
      </div>

      {loading ? (
        <div className="empty-chart">
          <p className="muted">
            Loading moderator statistics...
          </p>
        </div>
      ) : moderators.length === 0 ? (
        <div className="empty-chart">
          <p className="muted">
            No moderator statistics are
            available yet.
          </p>
        </div>
      ) : (
        <div className="moderator-chart">
          {moderators.map(moderator => {
            const value =
              moderator[valueKey];

            const width =
              max > 0
                ? Math.max(
                    5,
                    (value / max) * 100
                  )
                : 0;

            return (
              <div
                className="moderator-row"
                key={moderator.vrc_id}
              >
                <div className="moderator-label">
                  <span>
                    {moderator.vrc_name}
                  </span>

                  <strong>
                    {value}
                    {suffix}
                  </strong>
                </div>

                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${width}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function averageRatio(
  moderators: Moderator[]
) {
  if (moderators.length === 0) {
    return 0;
  }

  return (
    moderators.reduce(
      (total, moderator) =>
        total + moderator.ratio,
      0
    ) / moderators.length
  );
}

function AuditLogRow({
  log
}: {
  log: RadonAuditLog;
}) {
  const date = new Date(
    log.timestamp * 1000
  );

  const formattedDate =
    `${String(date.getUTCDate()).padStart(2, "0")}/` +
    `${String(date.getUTCMonth() + 1).padStart(2, "0")}/` +
    `${date.getUTCFullYear()} ` +
    `${String(date.getUTCHours()).padStart(2, "0")}:` +
    `${String(date.getUTCMinutes()).padStart(2, "0")}:` +
    `${String(date.getUTCSeconds()).padStart(2, "0")}`;

  const action =
    ACTION_NAMES[log.action] ||
    `Action ${log.action}`;

  return (
    <div className="audit-log-row">
      <div className="audit-log-time">
        {formattedDate}
      </div>

      <div className="audit-log-action">
        {action}
      </div>

      <div className="audit-log-details">
        {log.details ||
          "No details available."}
      </div>
    </div>
  );
}