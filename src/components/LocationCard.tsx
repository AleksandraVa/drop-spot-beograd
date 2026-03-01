import { useLanguage } from '@/i18n/LanguageContext';
import { MapPin, Clock, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  workingHours: string;
  pricePerHour: number;
  capacity: number;
  available: number;
  image: string;
  rating: number;
}

const LocationCard = ({ id, name, address, workingHours, pricePerHour, available, image, rating }: LocationCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-foreground">
          ⭐ {rating}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">{name}</h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{workingHours}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Luggage className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{available} {t.locations.available}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-foreground">
            <span className="font-heading text-xl font-bold">{pricePerHour} RSD</span>
            <span className="text-sm text-muted-foreground">{t.locations.perHour}</span>
          </div>
          <Link to={`/locations/${id}`}>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {t.locations.bookNow}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
