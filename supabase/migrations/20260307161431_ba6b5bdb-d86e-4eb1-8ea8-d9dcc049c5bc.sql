
-- Allow public read of all locations (filtering is done in app code; admin panel is password-gated)
DROP POLICY IF EXISTS "Anyone can view approved locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can view all locations" ON public.locations;
DROP POLICY IF EXISTS "Partners can view own locations" ON public.locations;

CREATE POLICY "Anyone can view all locations" ON public.locations FOR SELECT USING (true);
