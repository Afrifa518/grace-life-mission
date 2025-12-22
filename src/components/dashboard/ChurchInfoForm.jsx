import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const defaultInfo = {
  slug: 'default',
  church_name: '',
  email: '',
  phone_primary: '',
  phone_secondary: '',
  whatsapp: '',
  address_line1: '',
  address_line2: '',
  city: '',
  region: '',
  country: '',
  map_url: '',
};

const ChurchInfoForm = ({ initialData, onSaved }) => {
  const [form, setForm] = useState(defaultInfo);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        slug: initialData.slug || 'default',
        church_name: initialData.church_name || '',
        email: initialData.email || '',
        phone_primary: initialData.phone_primary || '',
        phone_secondary: initialData.phone_secondary || '',
        whatsapp: initialData.whatsapp || '',
        address_line1: initialData.address_line1 || '',
        address_line2: initialData.address_line2 || '',
        city: initialData.city || '',
        region: initialData.region || '',
        country: initialData.country || '',
        map_url: initialData.map_url || '',
      });
    } else {
      setForm(defaultInfo);
    }
  }, [initialData]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      toast({ title: 'Supabase not configured', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        slug: 'default',
        church_name: form.church_name || null,
        email: form.email || null,
        phone_primary: form.phone_primary || null,
        phone_secondary: form.phone_secondary || null,
        whatsapp: form.whatsapp || null,
        address_line1: form.address_line1 || null,
        address_line2: form.address_line2 || null,
        city: form.city || null,
        region: form.region || null,
        country: form.country || null,
        map_url: form.map_url || null,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('church_info')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('church_info')
          .upsert([payload], { onConflict: 'slug' });
        if (error) throw error;
      }

      toast({ title: 'Church info saved' });
      onSaved?.();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Church Name</label>
          <input name="church_name" value={form.church_name} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Email</label>
          <input type="email" name="email" value={form.email} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">WhatsApp</label>
          <input name="whatsapp" value={form.whatsapp} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Phone (Primary)</label>
          <input name="phone_primary" value={form.phone_primary} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Phone (Secondary)</label>
          <input name="phone_secondary" value={form.phone_secondary} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Address Line 1</label>
          <input name="address_line1" value={form.address_line1} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Address Line 2</label>
          <input name="address_line2" value={form.address_line2} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">City</label>
          <input name="city" value={form.city} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Region</label>
          <input name="region" value={form.region} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Country</label>
          <input name="country" value={form.country} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Map URL (optional)</label>
          <input name="map_url" value={form.map_url} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="https://maps.google.com/..." />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </form>
  );
};

export default ChurchInfoForm;
