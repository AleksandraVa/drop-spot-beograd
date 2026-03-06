
-- Create storage bucket for location images
INSERT INTO storage.buckets (id, name, public) VALUES ('location-images', 'location-images', true);

-- Allow authenticated users to upload to location-images
CREATE POLICY "Authenticated users can upload location images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'location-images');

-- Allow public read access
CREATE POLICY "Public can view location images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'location-images');
