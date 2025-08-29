CREATE TABLE public.app_config (
  key text NOT NULL,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT app_config_pkey PRIMARY KEY (key)
);

CREATE TABLE public.contest_winners (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  contest_id bigint NOT NULL,
  winner_id uuid NOT NULL,
  rank integer NOT NULL,
  prize_awarded numeric NOT NULL,
  awarded_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contest_winners_pkey PRIMARY KEY (id),
  CONSTRAINT contest_winners_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.profiles(id),
  CONSTRAINT contest_winners_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id)
);

CREATE TABLE public.contests (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  prize_pool numeric NOT NULL,
  status text NOT NULL DEFAULT 'active'::text,
  end_date timestamp with time zone NOT NULL,
  creator_id uuid NOT NULL,
  requirements jsonb,
  rules jsonb,
  payment_status text NOT NULL DEFAULT 'pending'::text,
  payment_details jsonb,
  paid_at timestamp with time zone,
  video_file_path text,
  video_file_size bigint,
  youtube_link text,
  video_upload_type text NOT NULL DEFAULT 'none'::text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contests_pkey PRIMARY KEY (id),
  CONSTRAINT contests_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.payout_requests (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  bank_details jsonb NOT NULL,
  midtrans_reference_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payout_requests_pkey PRIMARY KEY (id),
  CONSTRAINT payout_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  username text UNIQUE CHECK (char_length(username) >= 3),
  role text NOT NULL DEFAULT 'clipper'::text,
  updated_at timestamp with time zone DEFAULT now(),
  phone_number text,
  balance numeric NOT NULL DEFAULT 0.00,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.saved_contests (
  user_id uuid NOT NULL,
  contest_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT saved_contests_pkey PRIMARY KEY (user_id, contest_id),
  CONSTRAINT saved_contests_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id),
  CONSTRAINT saved_contests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.social_connections (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  platform text NOT NULL,
  platform_user_id text NOT NULL,
  username text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  scopes text[],
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT social_connections_pkey PRIMARY KEY (id),
  CONSTRAINT social_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.submissions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  contest_id bigint NOT NULL,
  clipper_id uuid NOT NULL,
  video_url text NOT NULL,
  platform text NOT NULL,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  last_synced_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending_ownership_check'::text,
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_clipper_id_fkey FOREIGN KEY (clipper_id) REFERENCES public.profiles(id),
  CONSTRAINT submissions_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(id)
);



