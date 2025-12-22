import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const defaultServiceTime = {
  day: '',
  times: '',
  special: '',
  status: 'published',
  order: 0,
};

const ServiceTimeForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultServiceTime);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        day: initialData.day || '',
        times: initialData.times || '',
        special: initialData.special || '',
        status: initialData.status || 'published',
        order: typeof initialData.order === 'number' ? initialData.order : (initialData.order || 0),
      });
    } else {
      setForm(defaultServiceTime);
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
        day: form.day,
        times: form.times,
        special: form.special || null,
        status: form.status || 'published',
        order: Number.isFinite(Number(form.order)) ? Number(form.order) : 0,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('service_times')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Service time updated' });
      } else {
        const { error } = await supabase
          .from('service_times')
          .insert([payload]);
        if (error) throw error;
        toast({ title: 'Service time created' });
      }

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
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Day</label>
          <input
            name="day"
            value={form.day}
            onChange={updateField}
            required
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Sunday"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Times</label>
          <input
            name="times"
            value={form.times}
            onChange={updateField}
            required
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="8:00 AM & 11:00 AM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Special</label>
          <input
            name="special"
            value={form.special}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Worship Service"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Order</label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</Button>
      </div>
    </form>
  );
};

export default ServiceTimeForm;
