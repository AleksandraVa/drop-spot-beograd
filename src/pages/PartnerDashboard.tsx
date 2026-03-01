import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReservations } from '@/data/mockData';
import Footer from '@/components/Footer';

const PartnerDashboard = () => {
  const { t } = useLanguage();
  const [locationForm, setLocationForm] = useState({
    name: 'Caffe Bar Central',
    address: 'Knez Mihailova 22, Beograd',
    workingHours: '08:00 - 22:00',
    capacity: '12',
    pricePerHour: '150',
  });

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-primary py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            {t.partner.title}
          </h1>
          <div className="mt-2">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-none">
              {t.partner.status}: {t.partner.approved}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="location">
          <TabsList className="mb-6">
            <TabsTrigger value="location">{t.partner.myLocation}</TabsTrigger>
            <TabsTrigger value="reservations">{t.partner.reservations}</TabsTrigger>
          </TabsList>

          <TabsContent value="location">
            <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-card">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
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
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
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
                    {mockReservations.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{r.id}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{r.guestName}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{r.date}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{r.timeFrom} - {r.timeTo}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{r.bags}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerDashboard;
