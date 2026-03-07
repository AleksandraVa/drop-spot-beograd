
-- Create a trigger function to update available spots when reservations change
CREATE OR REPLACE FUNCTION public.update_location_available()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _location_id uuid;
  _reservation_count integer;
  _capacity integer;
BEGIN
  -- Determine which location_id to update
  IF TG_OP = 'DELETE' THEN
    _location_id := OLD.location_id;
  ELSE
    _location_id := NEW.location_id;
  END IF;

  -- Count total bags reserved for this location
  SELECT COALESCE(SUM(bags), 0) INTO _reservation_count
  FROM public.reservations
  WHERE location_id = _location_id;

  -- Get the capacity
  SELECT capacity INTO _capacity
  FROM public.locations
  WHERE id = _location_id;

  -- Update available = capacity - reserved bags
  UPDATE public.locations
  SET available = GREATEST(_capacity - _reservation_count, 0)
  WHERE id = _location_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on reservations table
CREATE TRIGGER update_available_on_reservation
AFTER INSERT OR UPDATE OR DELETE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_location_available();
