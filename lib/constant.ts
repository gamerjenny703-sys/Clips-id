// Database Types Declaration
// Generated from PostgreSQL schema

export interface AppConfig {
  key: string;
  value: string;
  updated_at: Date;
}

export interface Profile {
  id: string; // UUID
  full_name: string | null;
  username: string | null;
  updated_at: Date | null;
  phone_number: string | null;
  balance: number;
  is_clipper: boolean;
  is_creator: boolean;
}

export interface Contest {
  id?: number; // bigint
  created_at?: string;
  title?: string;
  description?: string | null;
  prize_pool?: number; // numeric
  status?: string;
  end_date?: Date;
  creator_id?: string; // UUID
  creatorName?: string;
  requirements?: Record<string, any> | null; // jsonb
  rules?: Record<string, any> | null; // jsonb
  video_file_path?: string | null;
  video_file_size?: number | null; // bigint
  youtube_link?: string | null;
  video_upload_type?: "none" | "file" | "youtube_link";
  payment_status?: string;
  payment_details?: Record<string, any> | null; // jsonb
  paid_at?: Date | null;
  updated_at?: Date | null;
  image: string;
  tags: string[];
}

export interface ContestWinner {
  id: number; // bigint
  contest_id: number; // bigint
  winner_id: string; // UUID
  rank: number;
  prize_awarded: number; // numeric
  awarded_at: Date;
}

export interface PayoutRequest {
  id: number; // bigint
  user_id: string; // UUID
  amount: number; // numeric
  status: string;
  bank_details: Record<string, any>; // jsonb
  midtrans_reference_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SavedContest {
  user_id: string; // UUID
  contest_id: number; // bigint
  created_at: Date;
}

export interface SocialConnection {
  id: number; // bigint
  user_id: string; // UUID
  platform: string;
  platform_user_id: string;
  username: string;
  access_token: string;
  refresh_token: string | null;
  scopes: string[] | null;
  expires_at: Date | null;
  created_at: Date;
}

export interface Submission {
  id: number; // bigint
  created_at: Date;
  contest_id: number; // bigint
  clipper_id: string; // UUID
  video_url: string;
  platform: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  engagement_score: number; // numeric
  last_synced_at: Date | null;
  status: string;
}

// Enums for specific string literal types
export type VideoUploadType = "none" | "file" | "youtube_link";

export type PaymentStatus = "pending" | "paid" | "failed"; // extend as needed

export type ContestStatus = "active" | "ended" | "cancelled"; // extend as needed

export type PayoutRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"; // extend as needed

export type SubmissionStatus =
  | "pending_ownership_check"
  | "approved"
  | "rejected"; // extend as needed

// Optional: Input types for create/update operations (without auto-generated fields)
export interface CreateContestInput {
  title: string;
  description?: string;
  prize_pool: number;
  end_date: Date;
  creator_id: string;
  requirements?: Record<string, any>;
  rules?: Record<string, any>;
  video_file_path?: string;
  video_file_size?: number;
  youtube_link?: string;
  video_upload_type?: VideoUploadType;
  payment_details?: Record<string, any>;
}

export interface CreateSubmissionInput {
  contest_id: number;
  clipper_id: string;
  video_url: string;
  platform: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
}

export interface CreateProfileInput {
  id: string; // UUID from auth.users
  full_name?: string;
  username?: string;
  phone_number?: string;
  is_clipper?: boolean;
  is_creator?: boolean;
}

export interface CreatePayoutRequestInput {
  user_id: string;
  amount: number;
  bank_details: Record<string, any>;
}

export interface CreateSocialConnectionInput {
  user_id: string;
  platform: string;
  platform_user_id: string;
  username: string;
  access_token: string;
  refresh_token?: string;
  scopes?: string[];
  expires_at?: Date;
}

// Update types (all fields optional except ID)
export interface UpdateContestInput {
  id: number;
  title?: string;
  description?: string;
  prize_pool?: number;
  status?: string;
  end_date?: Date;
  requirements?: Record<string, any>;
  rules?: Record<string, any>;
  video_file_path?: string;
  video_file_size?: number;
  youtube_link?: string;
  video_upload_type?: VideoUploadType;
  payment_status?: string;
  payment_details?: Record<string, any>;
  paid_at?: Date;
}

export interface UpdateProfileInput {
  id: string;
  full_name?: string;
  username?: string;
  phone_number?: string;
  balance?: number;
  is_clipper?: boolean;
  is_creator?: boolean;
}

// Query result types for joins (example)
export interface ContestWithCreator extends Contest {
  creator: Profile;
}

export interface SubmissionWithContest extends Submission {
  contest: Contest;
  clipper: Profile;
}

export interface ContestWinnerWithDetails extends ContestWinner {
  winner: Profile;
  contest: Contest;
}
