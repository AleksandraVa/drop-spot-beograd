
-- Locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 0,
  price_per_hour INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  confirmation_code TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time_from TIME NOT NULL,
  time_to TIME NOT NULL,
  bags INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Locations policies
CREATE POLICY "Anyone can view approved locations"
  ON public.locations FOR SELECT
  USING (approved = true);

CREATE POLICY "Partners can view own locations"
  ON public.locations FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

CREATE POLICY "Partners can insert own locations"
  ON public.locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Partners can update own locations"
  ON public.locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner_id);

CREATE POLICY "Admins can view all locations"
  ON public.locations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any location"
  ON public.locations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Reservations policies
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert reservations"
  ON public.reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can view reservations for their locations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = reservations.location_id
      AND locations.partner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger for locations
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
