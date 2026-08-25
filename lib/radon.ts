import type {
  ModeratorStats,
  RadonGroup,
  RadonResponse
} from "./types";

const RADON_API_URL =
  process.env.RADON_API_URL || "https://api.radon.bot";

const RADON_API_KEY = process.env.RADON_API_KEY;

const DEMO_MODE =
  process.env.RADON_DEMO_MODE === "true";

const demoGroup: RadonGroup = {
  vrc_group_id:
    "grp_9f93eeec-e2e0-4131-9f50-928a4506a26f",
  vrc_name: "The Cove",
  vrc_short_name: "COVE",
  vrc_banner:
    "https://api.vrchat.cloud/api/1/file/file_b64a7cec-e2c1-41f7-9211-0ea7ce033b26/1/file",
  vrc_description:
    "Welcome to The Cove! We are a chill 16+ group that avoids drama and just wants to chill.",
  vrc_created_at: 1776859016,
  vrc_discriminator: 9496,
  vrc_icon:
    "https://api.vrchat.cloud/api/1/file/file_d2fdb020-15dd-4534-ba49-f4747dff0773/1/file",
  vrc_member_count: 135,
  vrc_online_members_count: 9,
  vrc_is_verified: false,
  vrc_join_state: "open",
  vrc_languages: "eng",
  vrc_owner_id:
    "usr_ab3adb0a-ea06-427d-8ad9-e757fc50a521",
  vrc_rules:
    "1. No harassment/hate speech\n2. No NSFW\n3. No politics\n4. Please do not play music through your mic\n5. Staff have final say",
  vrc_tags: "",
  vrc_deleted: null,
  discord_server_id: 1496471155882590200,
  discord_server_name: "The Cove",
  discord_warn_channel_id: 1496472866760298500,
  discord_kick_channel_id: 1496472884233896000,
  discord_ban_channel_id: 1496472963124433000,
  discord_ban_request_channel_id: 1496472998977212700,
  discord_audit_log_channel_id: null,
  discord_staff_leaderboard_channel_id: null,
  discord_staff_leaderboard_message_id: null,
  default_log_tags: 1655147,
  branch: 2,
  last_updated: 1786873686
};

const demoStats: ModeratorStats = {
  total: 544,
  ratio: 89,
  unmarked: 60,
  marked: 470,
  warns: 14,
  kicks: 141,
  bans: 376,
  vrc_id:
    "usr_ab3adb0a-ea06-427d-8ad9-e757fc50a521",
  vrc_name: "purge0xFF",
  discord_id: 1395941522511237000,
  discord_name: "purge0xff"
};

function getHeaders() {
  if (!RADON_API_KEY) {
    throw new Error(
      "RADON_API_KEY is missing. Add it to .env.local."
    );
  }

  return {
    Authorization: RADON_API_KEY,
    Accept: "application/json"
  };
}

async function request<T>(path: string) {
  try {
    const response = await fetch(
      `${RADON_API_URL}${path}`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false as const,
        status: response.status,
        error:
          data?.message ||
          `Radon API returned ${response.status}`
      };
    }

    return {
      ok: true as const,
      data: data as T
    };
  } catch (error) {
    return {
      ok: false as const,
      status: 500,
      error:
        error instanceof Error
          ? error.message
          : "Could not connect to Radon API."
    };
  }
}

export async function getGroups() {
  if (DEMO_MODE) {
    return {
      ok: true as const,
      groups: [demoGroup]
    };
  }

  if (!RADON_API_KEY) {
    return {
      ok: false as const,
      error:
        "RADON_API_KEY is missing. Enable RADON_DEMO_MODE or add an API key."
    };
  }

  const result =
    await request<RadonResponse<RadonGroup[]>>(
      "/groups"
    );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    groups: result.data.extra
  };
}

export async function getGroup(groupId: string) {
  if (DEMO_MODE) {
    if (groupId === demoGroup.vrc_group_id) {
      return {
        ok: true as const,
        group: demoGroup
      };
    }

    return {
      ok: false as const,
      error: "Demo group not found."
    };
  }

  if (!RADON_API_KEY) {
    return {
      ok: false as const,
      error: "RADON_API_KEY is missing."
    };
  }

  const result =
    await request<RadonResponse<RadonGroup>>(
      `/groups/${encodeURIComponent(groupId)}`
    );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    group: result.data.extra
  };
}

export async function getModeratorStats(
  groupId: string,
  userId: string
) {
  if (DEMO_MODE) {
    return {
      ok: true as const,
      stats: demoStats
    };
  }

  if (!RADON_API_KEY) {
    return {
      ok: false as const,
      error: "RADON_API_KEY is missing."
    };
  }

  const result =
    await request<RadonResponse<ModeratorStats>>(
      `/groups/${encodeURIComponent(
        groupId
      )}/statistics/moderators/${encodeURIComponent(
        userId
      )}`
    );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    stats: result.data.extra
  };
}