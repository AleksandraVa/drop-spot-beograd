import { useLanguage } from '@/i18n/LanguageContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Luggage, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const LocationDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [location, setLocation] = useState<any>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    bags: '1',
  });
  const [booked, setBooked] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .eq('approved', true)
        .maybeSingle();
      setLocation(data);
      setLoadingLoc(false);
    };
    if (id) fetchLocation();
  }, [id]);

  if (loadingLoc) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!location) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Location not found.</p></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      // Redirect to auth with return URL
      navigate(`/auth?redirect=/locations/${id}`);
      return;
    }

    setSubmitting(true);
    const code = `R-${Date.now().toString(36).toUpperCase()}`;
    
    const { error } = await supabase.from('reservations').insert({
      location_id: location.id,
      user_id: user.id,
      confirmation_code: code,
      guest_name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time_from: form.timeFrom,
      time_to: form.timeTo,
      bags: parseInt(form.bags),
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    setConfirmationId(code);
    setBooked(true);
    setSubmitting(false);
  };

  if (booked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{t.booking.success}</h2>
          <p className="text-muted-foreground mb-1">{t.booking.confirmationNumber}:</p>
          <p className="font-heading text-3xl font-bold text-primary mb-6">{confirmationId}</p>
          <Link to="/locations">
            <Button variant="outline">{t.booking.backToLocations}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = location.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/locations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t.booking.backToLocations}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-xl">
              <img src={imageUrl} alt={location.name} className="h-64 w-full object-cover lg:h-80" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-6 mb-3">{location.name}</h1>
            {location.description && <p className="text-muted-foreground mb-4">{location.description}</p>}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {location.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {location.working_hours}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Luggage className="h-4 w-4 text-primary" />
                {location.available} / {location.capacity} {t.locations.available}
              </div>
            </div>
            <div className="mt-4 text-foreground">
              <span className="font-heading text-2xl font-bold">{location.price_per_hour} RSD</span>
              <span className="text-muted-foreground">{t.locations.perHour} {t.locations.perBag}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-fit">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">{t.booking.title}</h2>
            {!user && (
              <p className="text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                {t.booking.loginRequired}
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label>{t.booking.name}</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>{t.booking.email}</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>{t.booking.phone}</Label>
                <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>{t.booking.date}</Label>
                <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.booking.timeFrom}</Label>
                  <Input required type="time" value={form.timeFrom} onChange={(e) => setForm({ ...form, timeFrom: e.target.value })} />
                </div>
                <div>
                  <Label>{t.booking.timeTo}</Label>
                  <Input required type="time" value={form.timeTo} onChange={(e) => setForm({ ...form, timeTo: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>{t.booking.bags}</Label>
                <Input required type="number" min="1" max="10" value={form.bags} onChange={(e) => setForm({ ...form, bags: e.target.value })} />
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="mt-2 bg-gradient-accent text-accent-foreground font-semibold hover:opacity-90">
                {user ? t.booking.submit : t.booking.loginToBook}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationDetail;
