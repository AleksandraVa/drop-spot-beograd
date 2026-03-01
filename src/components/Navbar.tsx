import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, hasRole, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/locations', label: t.nav.locations },
    ...(user && hasRole('partner') ? [{ path: '/partner', label: t.nav.partnerDashboard }] : []),
    ...(user && hasRole('admin') ? [{ path: '/admin', label: t.nav.adminDashboard }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="DropSpot" className="h-9 w-9 rounded-lg object-contain" />
          <span className="font-heading text-xl font-bold text-foreground">DropSpot</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'sr' ? 'en' : 'sr')}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {language === 'sr' ? 'EN' : 'SR'}
          </button>

          {user ? (
            <Button size="sm" variant="outline" onClick={signOut} className="hidden md:flex">
              {t.nav.logout}
            </Button>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button size="sm" className="bg-gradient-primary font-medium text-primary-foreground hover:opacity-90">
                {t.nav.login}
              </Button>
            </Link>
          )}

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button size="sm" variant="outline" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full">
                {t.nav.logout}
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-gradient-primary font-medium text-primary-foreground">
                  {t.nav.login}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
