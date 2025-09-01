# Video Upload Feature for Contest Creation

## Overview
Fitur upload video telah ditambahkan ke form pembuatan kontes dengan batasan ukuran file 100MB dan opsi untuk link YouTube sebagai alternatif.

## Fitur Utama

### 1. Upload Video File
- **Batasan Ukuran**: Maksimal 100MB
- **Format yang Didukung**: MP4, AVI, MOV, WMV, FLV, WebM
- **Storage**: Video disimpan di Supabase Storage bucket `contest-videos`
- **Struktur Folder**: `contest-videos/{user_id}/{timestamp}.{extension}`

### 2. YouTube Link
- **Alternatif**: Jika video lebih dari 100MB, gunakan link YouTube
- **Validasi**: URL YouTube yang valid
- **Penyimpanan**: Link disimpan di database

### 3. Validasi
- **Ukuran File**: Otomatis cek batasan 100MB
- **Format File**: Hanya format video yang didukung
- **Authentication**: User harus login untuk upload

## Database Changes

### Tabel `contests` - Kolom Baru
```sql
ALTER TABLE contests
ADD COLUMN video_file_path TEXT,
ADD COLUMN video_file_size BIGINT,
ADD COLUMN youtube_link TEXT,
ADD COLUMN video_upload_type TEXT DEFAULT 'none'
CHECK (video_upload_type IN ('none', 'file', 'youtube_link'));
```

### Storage Bucket
- **Nama**: `contest-videos`
- **Public**: Ya (untuk akses read)
- **File Size Limit**: 100MB
- **MIME Types**: Video formats yang didukung

## Komponen

### VideoUpload Component
- **Lokasi**: `components/features/contest/VideoUpload.tsx`
- **Props**: `onVideoChange` callback untuk update parent state
- **State Management**: Internal state untuk upload progress dan error handling

### Integration
- **Form**: Terintegrasi di `app/creator/contest/new/page.tsx`
- **Validation**: Required field untuk video sebelum submit
- **Database**: Auto-save video info saat kontes dibuat

## Security & Permissions

### RLS Policies
```sql
-- Upload: Hanya user yang authenticated
CREATE POLICY "Allow authenticated users to upload contest videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'contest-videos' AND auth.role() = 'authenticated'
);

-- Read: Public access
CREATE POLICY "Allow public read access to contest videos" ON storage.objects
FOR SELECT USING (bucket_id = 'contest-videos');

-- Update/Delete: Hanya pemilik file
CREATE POLICY "Allow users to update their own contest videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'contest-videos' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Usage

### 1. Upload Video File
1. Klik "Upload Video File"
2. Pilih file video (max 100MB)
3. Klik "Upload Video"
4. Tunggu progress upload selesai

### 2. YouTube Link
1. Klik "YouTube Link"
2. Paste URL YouTube video
3. Link otomatis tersimpan

### 3. Form Validation
- Video (file atau link) wajib diisi
- Error message jika tidak ada video
- Auto-disable submit button sampai video ada

## Error Handling

### Common Errors
- **File Too Large**: "File size exceeds 100MB limit. Please upload to YouTube and provide the link instead."
- **Invalid Format**: "Please select a valid video file (MP4, AVI, MOV, WMV, FLV, or WebM)."
- **Upload Failed**: "Upload failed. Please try again."
- **No Video**: "Please upload a video or provide a YouTube link for your contest."

### User Experience
- Clear error messages dengan styling yang konsisten
- Progress bar untuk upload
- File info display (nama, ukuran)
- Easy file removal dan replacement

## Future Enhancements

### Potential Improvements
1. **Video Preview**: Thumbnail generation
2. **Compression**: Auto-compress video sebelum upload
3. **Multiple Videos**: Support untuk multiple video uploads
4. **Video Processing**: Auto-convert format yang tidak didukung
5. **CDN Integration**: Cloudflare atau CDN lain untuk delivery

## Testing

### Test Cases
1. **File Upload**: Video < 100MB
2. **File Rejection**: Video > 100MB
3. **Format Validation**: File type checking
4. **YouTube Link**: Valid/invalid URL handling
5. **Authentication**: Upload tanpa login
6. **Storage**: File tersimpan dengan benar
7. **Database**: Data tersimpan dengan format yang benar

## Dependencies

### Required Packages
- `@supabase/supabase-js` - Client untuk Supabase
- `lucide-react` - Icons
- `@/components/ui/*` - UI components

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

### Common Issues
1. **Bucket Not Found**: Pastikan bucket `contest-videos` sudah dibuat
2. **Permission Denied**: Cek RLS policies sudah benar
3. **Upload Fails**: Cek file size dan format
4. **Storage Quota**: Monitor storage usage

### Debug Steps
1. Check browser console untuk error
2. Verify Supabase storage bucket exists
3. Check RLS policies
4. Verify user authentication
5. Check file size dan format
6. tetst md doang
