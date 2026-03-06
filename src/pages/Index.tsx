import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Shield, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-belgrade.jpg';
import LocationCard from '@/components/LocationCard';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const Index = () => {
  const { t } = useLanguage();
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('approved', true)
        .limit(3);
      setFeaturedLocations(data || []);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Belgrade" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl text-primary-foreground">
              {t.hero.title}
              <br />
              <span className="text-accent">{t.hero.titleHighlight}</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80 md:text-xl max-w-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/locations">
                <Button size="lg" className="bg-gradient-accent text-accent-foreground font-semibold hover:opacity-90 shadow-hero">
                  <Search className="mr-2 h-5 w-5" />
                  {t.hero.searchBtn}
                </Button>
              </Link>
              <Link to="/become-partner">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20">
                  {t.hero.partnerBtn}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl mb-12">
          {t.howItWorks.title}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Search, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, step: '01' },
            { icon: MapPin, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, step: '02' },
            { icon: Shield, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, step: '03' },
          ].map((item, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-border bg-card p-8 shadow-card text-center transition-all hover:shadow-card-hover"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </div>
              <div className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured locations */}
      {featuredLocations.length > 0 && (
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground">{t.locations.title}</h2>
              <Link to="/locations">
                <Button variant="outline">{t.hero.searchBtn}</Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredLocations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  id={loc.id}
                  name={loc.name}
                  address={loc.address}
                  workingHours={loc.working_hours}
                  pricePerHour={loc.price_per_hour}
                  capacity={loc.capacity}
                  available={loc.available}
                  image={loc.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop'}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
