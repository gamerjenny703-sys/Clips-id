# Payment System Database Migration

## Problem
Error yang muncul:
```
Error fetching contests: {
  code: '42703',
  details: null,
  hint: null,
  message: 'column contests.payment_status does not exist'
}
```

## Solution
Kita perlu menambahkan kolom-kolom yang diperlukan ke tabel `contests` di database.

## Steps to Fix

### 1. Buka Supabase Dashboard
- Login ke [supabase.com](https://supabase.com)
- Pilih project Clips ID
- Buka menu "SQL Editor"

### 2. Jalankan Migration SQL
Copy dan paste SQL berikut ke SQL Editor:

```sql
-- Migration: Add payment-related columns to contests table

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
```

### 3. Klik "Run" untuk menjalankan migration

### 4. Verifikasi
Setelah migration berhasil, cek bahwa kolom sudah ditambahkan:
- Buka menu "Table Editor"
- Pilih tabel "contests"
- Pastikan kolom baru sudah muncul:
  - `payment_status`
  - `payment_details`
  - `paid_at`
  - `video_file_path`
  - `video_file_size`
  - `youtube_link`
  - `video_upload_type`
  - `updated_at`

## What This Migration Adds

### Payment Columns
- **`payment_status`**: Status pembayaran (`pending`, `paid`, `failed`)
- **`payment_details`**: Detail pembayaran dari Midtrans (JSON)
- **`paid_at`**: Timestamp kapan pembayaran selesai

### Video Upload Columns
- **`video_file_path`**: Path ke file video yang diupload
- **`video_file_size`**: Ukuran file video dalam bytes
- **`youtube_link`**: URL video YouTube jika menggunakan YouTube link
- **`video_upload_type`**: Tipe video (`none`, `file`, `youtube_link`)

### Utility Columns
- **`updated_at`**: Timestamp kapan contest terakhir diupdate

## After Migration
Setelah migration berhasil:
1. Creator dashboard akan bisa menampilkan section "Payment Issues"
2. Create contest page akan bisa menyimpan kontes dengan status `pending_payment`
3. Payment retry system akan berfungsi dengan baik
4. Tidak ada lagi error "column contests.payment_status does not exist"

## Notes
- Migration ini aman untuk dijalankan karena menggunakan `IF NOT EXISTS`
- Data existing tidak akan hilang
- Kolom baru akan memiliki default values yang sesuai
