import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { signIn, signUp } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.auth.loginTitle);
        navigate(redirect);
      }
    } else {
      if (password !== confirmPassword) {
        toast.error(t.becomePartner.passwordMismatch);
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, 'user');
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.auth.registerTitle);
        navigate(redirect);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src={logo} alt="DropSpot" className="mx-auto mb-4 h-12 w-12 rounded-xl object-contain" />
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
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
            <Button type="submit" size="lg" disabled={loading} className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
              {loading ? '...' : isLogin ? t.auth.loginBtn : t.auth.registerBtn}
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
