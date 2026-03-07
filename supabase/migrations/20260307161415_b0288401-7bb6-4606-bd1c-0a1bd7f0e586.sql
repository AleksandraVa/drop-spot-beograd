
-- Fix locations SELECT policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view approved locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can view all locations" ON public.locations;
DROP POLICY IF EXISTS "Partners can view own locations" ON public.locations;

CREATE POLICY "Anyone can view approved locations" ON public.locations FOR SELECT USING (approved = true);
CREATE POLICY "Admins can view all locations" ON public.locations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Partners can view own locations" ON public.locations FOR SELECT USING (auth.uid() = partner_id);

-- Fix admin update/delete policies too
DROP POLICY IF EXISTS "Admins can update any location" ON public.locations;
DROP POLICY IF EXISTS "Admins can delete locations" ON public.locations;
DROP POLICY IF EXISTS "Partners can insert own locations" ON public.locations;
DROP POLICY IF EXISTS "Partners can update own locations" ON public.locations;

CREATE POLICY "Admins can update any location" ON public.locations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete locations" ON public.locations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Partners can insert own locations" ON public.locations FOR INSERT WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "Partners can update own locations" ON public.locations FOR UPDATE USING (auth.uid() = partner_id);

-- Fix reservations policies too
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Partners can view reservations for their locations" ON public.reservations;
DROP POLICY IF EXISTS "Users can insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;

CREATE POLICY "Admins can view all reservations" ON public.reservations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Partners can view reservations for their locations" ON public.reservations FOR SELECT USING (EXISTS (SELECT 1 FROM locations WHERE locations.id = reservations.location_id AND locations.partner_id = auth.uid()));
CREATE POLICY "Users can insert reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reservations" ON public.reservations FOR SELECT USING (auth.uid() = user_id);
