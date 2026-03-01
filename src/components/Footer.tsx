import { useLanguage } from '@/i18n/LanguageContext';
import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="DropSpot" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-heading text-lg font-bold text-foreground">DropSpot</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">{t.footer.links}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.home}</Link>
              <Link to="/locations" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.locations}</Link>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.login}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-3">{t.footer.contact}</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> info@dropspot.rs
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> Beograd, Srbija
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 DropSpot. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
