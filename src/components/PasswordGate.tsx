import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

interface PasswordGateProps {
  correctPassword: string;
  children: React.ReactNode;
}

const PasswordGate = ({ correctPassword, children }: PasswordGateProps) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
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
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••"
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive font-medium">{t.nav.wrongPassword}</p>
            )}
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {t.nav.accessBtn}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
