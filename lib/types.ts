
export type RadonGroup = {
  vrc_group_id: string;
  vrc_name: string;
  vrc_short_name?: string | null;
  vrc_banner?: string | null;
  vrc_description?: string | null;
  vrc_created_at?: number | null;
  vrc_discriminator?: number | null;
  vrc_icon?: string | null;
  vrc_member_count?: number | null;
  vrc_online_members_count?: number | null;
  vrc_is_verified?: boolean | null;
  vrc_join_state?: string | null;
  vrc_languages?: string | null;
  vrc_owner_id?: string | null;
  vrc_rules?: string | null;
  vrc_tags?: string | null;
  vrc_deleted?: unknown;
  discord_server_id?: number | null;
  discord_server_name?: string | null;
  discord_warn_channel_id?: number | null;
  discord_kick_channel_id?: number | null;
  discord_ban_channel_id?: number | null;
  discord_ban_request_channel_id?: number | null;
  discord_audit_log_channel_id?: number | null;
  discord_staff_leaderboard_channel_id?: number | null;
  discord_staff_leaderboard_message_id?: number | null;
  default_log_tags?: number | null;
  branch?: number | null;
  last_updated?: number | null;
};

export type ModeratorStats = {
  total: number;
  ratio: number;
  unmarked: number;
  marked: number;
  warns: number;
  kicks: number;
  bans: number;
  vrc_id: string;
  vrc_name: string;
  discord_id?: number | null;
  discord_name?: string | null;
};

export type RadonResponse<T> = {
  code: number;
  message: string;
  extra: T;
};