import { useLanguage } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import logo from '@/assets/logo.png';

const BecomePartner = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: '',
    workingHours: '',
    capacity: '',
    pricePerHour: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(t.becomePartner.passwordMismatch);
      return;
    }
    if (form.password.length < 6) {
      toast.error(t.becomePartner.passwordTooShort);
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up as partner
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: 'partner', full_name: form.name },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        toast.error('Registration failed');
        setLoading(false);
        return;
      }

      // 2. Upload image if provided
      let imageUrl: string | null = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `locations/${userId}/${Date.now()}.${fileExt}`;
        
        // Check if bucket exists, create if not
        const { error: uploadError } = await supabase.storage
          .from('location-images')
          .upload(filePath, imageFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('location-images')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }
      }

      // 3. Insert location
      const cap = parseInt(form.capacity);
      const avail = Math.max(1, Math.floor(cap * 0.7));
      const { error: locationError } = await supabase.from('locations').insert({
        partner_id: userId,
        name: form.name,
        address: form.address,
        working_hours: form.workingHours,
        capacity: cap,
        available: avail,
        price_per_hour: parseInt(form.pricePerHour),
        description: form.description || null,
        image_url: imageUrl,
        approved: false,
      });

      if (locationError) {
        toast.error(locationError.message);
        setLoading(false);
        return;
      }

      toast.success(t.becomePartner.success);
      navigate('/partner');
    } catch (err) {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="DropSpot" className="mx-auto mb-4 h-12 w-12 rounded-xl object-contain" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t.becomePartner.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t.becomePartner.subtitle}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="border-b border-border pb-4 mb-2">
                <h3 className="font-heading font-bold text-foreground mb-3">{t.becomePartner.accountSection}</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <Label>{t.auth.email} *</Label>
                    <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.auth.password} *</Label>
                    <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.auth.confirmPassword} *</Label>
                    <Input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-foreground mb-3">{t.becomePartner.locationSection}</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <Label>{t.partner.locationName} *</Label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.partner.address} *</Label>
                    <Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.partner.workingHours} *</Label>
                    <Input required value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} placeholder="08:00 - 22:00" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{t.partner.capacity} *</Label>
                      <Input type="number" required min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t.partner.pricePerHour} *</Label>
                      <Input type="number" required min="1" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>{t.becomePartner.image}</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" disabled={loading} className="mt-2 bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90">
                {loading ? '...' : t.becomePartner.submitBtn}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomePartner;
