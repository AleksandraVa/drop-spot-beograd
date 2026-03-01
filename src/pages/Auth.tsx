import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Luggage } from 'lucide-react';

const Auth = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'partner' ? 'partner' : 'user';

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'partner'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to backend later
    alert(isLogin ? 'Login coming soon!' : 'Registration coming soon!');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
            <Luggage className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {!isLogin && (
            <div className="mb-6 flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  role === 'user' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.auth.asUser}
              </button>
              <button
                type="button"
                onClick={() => setRole('partner')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  role === 'partner' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.auth.asPartner}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label>{t.auth.email}</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>{t.auth.password}</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {!isLogin && (
              <div>
                <Label>{t.auth.confirmPassword}</Label>
                <Input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            )}
            <Button type="submit" size="lg" className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
              {isLogin ? t.auth.loginBtn : t.auth.registerBtn}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? t.auth.registerLink : t.auth.loginLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
