import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { eventCategories } from '@/data/eventsData';
import { uploadToStorage } from '@/lib/utils';

const defaultEvent = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  category: eventCategories[0],
  recurring: '',
  status: 'draft',
  imageUrl: '',
  schedule: [],
};

const EventForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultEvent);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      const initialSchedule = Array.isArray(initialData.schedule) && initialData.schedule.length > 0
        ? initialData.schedule
        : (initialData.date || initialData.time)
          ? [{ date: initialData.date ? initialData.date.slice(0, 10) : '', time: initialData.time || '' }]
          : [];
      setForm({
        title: initialData.title || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        time: initialData.time || '',
        location: initialData.location || '',
        description: initialData.description || '',
        category: initialData.category || eventCategories[0],
        recurring: initialData.recurring || '',
        status: initialData.status || 'draft',
        imageUrl: initialData.imageUrl || '',
        schedule: initialSchedule,
      });
    }
  }, [initialData]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const updateSchedule = (index, key, value) => {
    setForm(prev => {
      const next = [...(prev.schedule || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, schedule: next };
    });
  };

  const addScheduleItem = () => {
    setForm(prev => ({ ...prev, schedule: [ ...(prev.schedule || []), { date: '', time: '' } ] }));
  };

  const removeScheduleItem = (index) => {
    setForm(prev => {
      const next = [...(prev.schedule || [])];
      next.splice(index, 1);
      return { ...prev, schedule: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      toast({ title: 'Supabase not configured', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };

      // Normalize schedule: remove empty entries
      const cleanedSchedule = (payload.schedule || []).filter(s => (s.date && s.time));
      payload.schedule = cleanedSchedule;

      // Mirror first schedule to legacy date/time for compatibility
      if (cleanedSchedule.length > 0) {
        payload.date = cleanedSchedule[0].date;
        payload.time = cleanedSchedule[0].time;
      }

      if (imageFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'events', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      // Ensure capacity is not sent (removed field)
      delete payload.capacity;

      if (isEdit) {
        const { error } = await supabase.from('events').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Event updated' });
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        toast({ title: 'Event created' });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input name="title" value={form.title} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input name="location" value={form.location} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="category" value={form.category} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            {eventCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recurring</label>
          <input name="recurring" placeholder="e.g. Weekly, Monthly" value={form.recurring} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (one or more days)</label>
        <div className="space-y-3">
          {(form.schedule || []).map((slot, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Date</label>
                <input type="date" value={slot.date} onChange={(e) => updateSchedule(idx, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Time</label>
                <input value={slot.time} onChange={(e) => updateSchedule(idx, 'time', e.target.value)} placeholder="e.g. 10:00 AM - 12:00 PM" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => removeScheduleItem(idx)}>Remove</Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addScheduleItem}>Add Day</Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}</Button>
      </div>
    </form>
  );
};

export default EventForm; 