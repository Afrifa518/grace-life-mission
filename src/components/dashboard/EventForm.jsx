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
  capacity: 0,
  status: 'draft',
  imageUrl: '',
};

const EventForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultEvent);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        time: initialData.time || '',
        location: initialData.location || '',
        description: initialData.description || '',
        category: initialData.category || eventCategories[0],
        recurring: initialData.recurring || '',
        capacity: initialData.capacity || 0,
        status: initialData.status || 'draft',
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

      if (imageFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'events', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input type="date" name="date" value={form.date} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input name="time" value={form.time} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <input type="number" name="capacity" value={form.capacity} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
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