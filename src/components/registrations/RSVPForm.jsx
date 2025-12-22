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

  useEffect(() => {
    setForm(defaultForm);
  }, [event?.id]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
        <div className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-800">{event?.title || '—'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input name="name" value={form.name} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" name="email" value={form.email} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
          <input name="phone" value={form.phone} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <input type="number" min={1} name="guests" value={form.guests} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit RSVP'}</Button>
      </div>
    </form>
  );
};

export default RSVPForm;
