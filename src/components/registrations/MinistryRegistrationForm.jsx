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

  useEffect(() => {
    setForm(defaultForm);
  }, [ministry?.id]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ministry</label>
        <div className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-800">{ministry?.title || '—'}</div>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </form>
  );
};

export default MinistryRegistrationForm;
