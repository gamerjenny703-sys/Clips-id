-- Migration: Add payment-related columns to contests table
-- Run this SQL in your Supabase SQL editor

-- Add payment_status column
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- Add payment_details column
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS payment_details jsonb;

-- Add paid_at column
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;

-- Add video-related columns
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS video_file_path text;

ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS video_file_size bigint;

ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS youtube_link text;

ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS video_upload_type text NOT NULL DEFAULT 'none';

-- Add updated_at column
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update existing contests to have proper payment_status
UPDATE public.contests 
SET payment_status = 'paid' 
WHERE status = 'active' AND payment_status = 'pending';

-- Add comment to document the new columns
COMMENT ON COLUMN public.contests.payment_status IS 'Payment status: pending, paid, failed';
COMMENT ON COLUMN public.contests.payment_details IS 'JSON details from payment provider (Midtrans)';
COMMENT ON COLUMN public.contests.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN public.contests.video_file_path IS 'Path to uploaded video file';
COMMENT ON COLUMN public.contests.video_file_size IS 'Size of uploaded video file in bytes';
COMMENT ON COLUMN public.contests.youtube_link IS 'YouTube video URL if using YouTube link';
COMMENT ON COLUMN public.contests.video_upload_type IS 'Type of video: none, file, youtube_link';
COMMENT ON COLUMN public.contests.updated_at IS 'Timestamp when contest was last updated';
