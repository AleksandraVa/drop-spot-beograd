import { useLanguage } from '@/i18n/LanguageContext';
import { useParams, Link } from 'react-router-dom';
import { mockLocations } from '@/data/mockData';
import { MapPin, Clock, Luggage, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Footer from '@/components/Footer';

const LocationDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const location = mockLocations.find((l) => l.id === id);

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

  if (!location) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Location not found.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `R-${Date.now().toString(36).toUpperCase()}`;
    setConfirmationId(id);
    setBooked(true);
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/locations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t.booking.backToLocations}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Location info */}
          <div>
            <div className="overflow-hidden rounded-xl">
              <img src={location.image} alt={location.name} className="h-64 w-full object-cover lg:h-80" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-6 mb-3">{location.name}</h1>
            <p className="text-muted-foreground mb-4">{location.description}</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {location.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {location.workingHours}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Luggage className="h-4 w-4 text-primary" />
                {location.available} / {location.capacity} {t.locations.available}
              </div>
            </div>
            <div className="mt-4 text-foreground">
              <span className="font-heading text-2xl font-bold">{location.pricePerHour} RSD</span>
              <span className="text-muted-foreground">{t.locations.perHour} {t.locations.perBag}</span>
            </div>
          </div>

          {/* Booking form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-fit">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">{t.booking.title}</h2>
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
              <Button type="submit" size="lg" className="mt-2 bg-gradient-accent text-accent-foreground font-semibold hover:opacity-90">
                {t.booking.submit}
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
