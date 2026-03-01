import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import LocationCard from '@/components/LocationCard';
import Footer from '@/components/Footer';
import { mockLocations } from '@/data/mockData';

const Locations = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = mockLocations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl mb-3">
            {t.locations.title}
          </h1>
          <p className="text-primary-foreground/80 mb-6 max-w-lg">{t.locations.subtitle}</p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.locations.search}
              className="pl-10 bg-card border-none shadow-card"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((loc) => (
            <LocationCard key={loc.id} {...loc} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16 text-lg">
            {t.locations.search} — 0 results
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Locations;
