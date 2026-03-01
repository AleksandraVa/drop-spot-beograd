import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPendingPartners, mockLocations } from '@/data/mockData';
import { Check, X, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState(mockPendingPartners);

  const handleApprove = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id));
  };

  const handleReject = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-primary py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            {t.admin.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="partners">
          <TabsList className="mb-6">
            <TabsTrigger value="partners">{t.admin.pendingPartners}</TabsTrigger>
            <TabsTrigger value="locations">{t.admin.allLocations}</TabsTrigger>
          </TabsList>

          <TabsContent value="partners">
            {partners.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center">{t.admin.noPartners}</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {partners.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <h3 className="font-heading font-bold text-foreground mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.address}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{p.email}</p>
                    <Badge variant="secondary" className="mb-3">{t.partner.capacity}: {p.capacity}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                        <Check className="mr-1 h-4 w-4" />
                        {t.admin.approve}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(p.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <X className="mr-1 h-4 w-4" />
                        {t.admin.reject}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations">
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.partner.locationName}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.locations.address}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.locations.capacity}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t.locations.price}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLocations.map((l) => (
                      <tr key={l.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{l.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{l.address}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{l.capacity}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{l.pricePerHour} RSD</td>
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

export default AdminDashboard;
