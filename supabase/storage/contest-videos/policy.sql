-- Storage policies for contest-videos bucket
-- This file defines who can access and modify contest video files

-- Allow authenticated users to upload contest videos
CREATE POLICY "Allow authenticated users to upload contest videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'contest-videos' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to contest videos
CREATE POLICY "Allow public read access to contest videos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'contest-videos'
);

-- Allow users to update their own contest videos
CREATE POLICY "Allow users to update their own contest videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'contest-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own contest videos
CREATE POLICY "Allow users to delete their own contest videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'contest-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
