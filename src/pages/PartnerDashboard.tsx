import { useLanguage } from '@/i18n/LanguageContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const PartnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [location, setLocation] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    workingHours: '',
    capacity: '',
    pricePerHour: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Get partner's location
      const { data: locData } = await supabase
        .from('locations')
        .select('*')
        .eq('partner_id', user.id)
        .maybeSingle();
      
      if (locData) {
        setLocation(locData);
        setLocationForm({
          name: locData.name,
          address: locData.address,
          workingHours: locData.working_hours,
          capacity: String(locData.capacity),
          pricePerHour: String(locData.price_per_hour),
        });

        // Get reservations for this location
        const { data: resData } = await supabase
          .from('reservations')
          .select('*')
          .eq('location_id', locData.id);
        setReservations(resData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!location) return;
    const newCapacity = parseInt(locationForm.capacity);
    // Calculate new available: capacity - reserved bags
    const { data: resData } = await supabase
      .from('reservations')
      .select('bags')
      .eq('location_id', location.id);
    const totalBags = (resData || []).reduce((sum: number, r: any) => sum + r.bags, 0);
    const newAvailable = Math.max(newCapacity - totalBags, 0);

    const { error } = await supabase
      .from('locations')
      .update({
        name: locationForm.name,
        address: locationForm.address,
        working_hours: locationForm.workingHours,
        capacity: newCapacity,
        available: newAvailable,
        price_per_hour: parseInt(locationForm.pricePerHour),
      })
      .eq('id', location.id);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.partner.save);
      setLocation({ ...location, name: locationForm.name, address: locationForm.address, working_hours: locationForm.workingHours, capacity: newCapacity, available: newAvailable, price_per_hour: parseInt(locationForm.pricePerHour) });
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-primary py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            {t.partner.title}
          </h1>
          {location && (
            <div className="mt-2">
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-none">
                {t.partner.status}: {location.approved ? t.partner.approved : t.partner.pending}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!location ? (
          <p className="text-muted-foreground text-center py-12">{t.partner.noReservations}</p>
        ) : (
          <Tabs defaultValue="location">
            <TabsList className="mb-6">
              <TabsTrigger value="location">{t.partner.myLocation}</TabsTrigger>
              <TabsTrigger value="reservations">{t.partner.reservations}</TabsTrigger>
            </TabsList>

            <TabsContent value="location">
              <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-card">
                <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div>
                    <Label>{t.partner.locationName}</Label>
                    <Input value={locationForm.name} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.partner.address}</Label>
                    <Input value={locationForm.address} onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.partner.workingHours}</Label>
                    <Input value={locationForm.workingHours} onChange={(e) => setLocationForm({ ...locationForm, workingHours: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{t.partner.capacity}</Label>
                      <Input type="number" value={locationForm.capacity} onChange={(e) => setLocationForm({ ...locationForm, capacity: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t.partner.pricePerHour}</Label>
                      <Input type="number" value={locationForm.pricePerHour} onChange={(e) => setLocationForm({ ...locationForm, pricePerHour: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    {t.partner.save}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="reservations">
              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.partner.guest}</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.partner.date}</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.partner.time}</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.partner.bags}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{t.partner.noReservations}</td>
                        </tr>
                      ) : (
                        reservations.map((r) => (
                          <tr key={r.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{r.confirmation_code}</td>
                            <td className="px-4 py-3 text-sm text-foreground">{r.guest_name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{r.date}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{r.time_from} - {r.time_to}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{r.bags}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PartnerDashboard;
