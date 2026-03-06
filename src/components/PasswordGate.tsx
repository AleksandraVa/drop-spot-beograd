import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordGateProps {
  correctPassword?: string;
  useAuth?: boolean;
  children: React.ReactNode;
}

const PasswordGate = ({ correctPassword, useAuth = false, children }: PasswordGateProps) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useAuth) {
      // Partner panel: authenticate via Supabase
      setLoading(true);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      
      if (authError) {
        setError(true);
      } else {
        setUnlocked(true);
        setError(false);
      }
    } else {
      // Admin panel: simple password check
      if (password === correctPassword) {
        setUnlocked(true);
        setError(false);
      } else {
        setError(true);
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t.nav.enterPassword}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {useAuth && (
              <div className="text-left">
                <Label>{t.auth.email}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(false); }}
                  required
                />
              </div>
            )}
            <div className={useAuth ? 'text-left' : ''}>
              {useAuth && <Label>{t.auth.password}</Label>}
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder={useAuth ? '' : '••••••'}
                className={error ? 'border-destructive' : ''}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{t.nav.wrongPassword}</p>
            )}
            <Button type="submit" disabled={loading} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {loading ? '...' : t.nav.accessBtn}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
