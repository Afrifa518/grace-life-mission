import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const MinistryRegistrationForm = ({ ministry, onCancel, onSaved }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(defaultForm);
    setErrors({});
  }, [ministry?.id]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!supabase) {
      toast({ title: 'Supabase not configured', variant: 'destructive' });
      return;
    }

    if (!ministry?.id) {
      toast({ title: 'Missing ministry', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ministry_id: ministry.id,
        ministry_title: ministry.title || '',
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message || null,
        status: 'new',
      };

      const { error } = await supabase.from('ministry_registrations').insert([payload]);
      if (error) throw error;

      toast({ title: 'Registration received', description: 'Thank you! A leader will contact you soon.' });
      onSaved?.();
    } catch (err) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
      errors[field] ? 'border-destructive bg-destructive/5' : 'border-border'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="ministry-reg-ministry" className="block text-sm font-medium text-foreground/80 mb-2">Ministry</label>
        <div id="ministry-reg-ministry" className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground">{ministry?.title || '\u2014'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ministry-reg-name" className="block text-sm font-medium text-foreground/80 mb-2">Name *</label>
          <input
            id="ministry-reg-name"
            name="name"
            value={form.name}
            onChange={updateField}
            className={inputClass('name')}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'ministry-reg-name-error' : undefined}
          />
          {errors.name && <p id="ministry-reg-name-error" className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="ministry-reg-email" className="block text-sm font-medium text-foreground/80 mb-2">Email *</label>
          <input
            id="ministry-reg-email"
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            className={inputClass('email')}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'ministry-reg-email-error' : undefined}
          />
          {errors.email && <p id="ministry-reg-email-error" className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="ministry-reg-phone" className="block text-sm font-medium text-foreground/80 mb-2">Phone (optional)</label>
          <input id="ministry-reg-phone" name="phone" value={form.phone} onChange={updateField} className={inputClass('phone')} />
        </div>
      </div>

      <div>
        <label htmlFor="ministry-reg-message" className="block text-sm font-medium text-foreground/80 mb-2">Message (optional)</label>
        <textarea id="ministry-reg-message" name="message" value={form.message} onChange={updateField} rows={4} className={inputClass('message')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </form>
  );
};

export default MinistryRegistrationForm;
