import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  guests: 1,
  message: '',
};

const RSVPForm = ({ event, onCancel, onSaved }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(defaultForm);
    setErrors({});
  }, [event?.id]);

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

    if (!event?.id) {
      toast({ title: 'Missing event', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const eventDate = (event.schedule && event.schedule[0]?.date) || event.date || null;
      const payload = {
        event_id: event.id,
        event_title: event.title || '',
        event_date: eventDate,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        guests: Number(form.guests || 1),
        message: form.message || null,
        status: 'new',
      };

      const { error } = await supabase.from('event_rsvps').insert([payload]);
      if (error) throw error;

      toast({ title: 'RSVP received', description: 'Thank you! We look forward to seeing you.' });
      onSaved?.();
    } catch (err) {
      toast({ title: 'RSVP failed', description: err.message, variant: 'destructive' });
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
        <label htmlFor="rsvp-event" className="block text-sm font-medium text-foreground/80 mb-2">Event</label>
        <div id="rsvp-event" className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground">{event?.title || '\u2014'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rsvp-name" className="block text-sm font-medium text-foreground/80 mb-2">Name *</label>
          <input
            id="rsvp-name"
            name="name"
            value={form.name}
            onChange={updateField}
            className={inputClass('name')}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
          />
          {errors.name && <p id="rsvp-name-error" className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="rsvp-email" className="block text-sm font-medium text-foreground/80 mb-2">Email *</label>
          <input
            id="rsvp-email"
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            className={inputClass('email')}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'rsvp-email-error' : undefined}
          />
          {errors.email && <p id="rsvp-email-error" className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="rsvp-phone" className="block text-sm font-medium text-foreground/80 mb-2">Phone (optional)</label>
          <input id="rsvp-phone" name="phone" value={form.phone} onChange={updateField} className={inputClass('phone')} />
        </div>
        <div>
          <label htmlFor="rsvp-guests" className="block text-sm font-medium text-foreground/80 mb-2">Guests</label>
          <input id="rsvp-guests" type="number" min={1} max={20} name="guests" value={form.guests} onChange={updateField} className={inputClass('guests')} />
        </div>
      </div>

      <div>
        <label htmlFor="rsvp-message" className="block text-sm font-medium text-foreground/80 mb-2">Message (optional)</label>
        <textarea id="rsvp-message" name="message" value={form.message} onChange={updateField} rows={4} className={inputClass('message')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit RSVP'}</Button>
      </div>
    </form>
  );
};

export default RSVPForm;
