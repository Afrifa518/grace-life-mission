import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const defaultMinistry = {
  title: '',
  subtitle: '',
  leader: '',
  meetingTime: '',
  description: '',
  color: 'from-blue-600 to-purple-600',
  status: 'published',
  order: 0,
  features: '', // comma-separated string
  imageUrl: '',
};

const MinistryForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultMinistry);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        leader: initialData.leader || '',
        meetingTime: initialData.meetingTime || '',
        description: initialData.description || '',
        color: initialData.color || 'from-blue-600 to-purple-600',
        status: initialData.status || 'published',
        order: initialData.order || 0,
        features: Array.isArray(initialData.features) ? initialData.features.join(', ') : (initialData.features || ''),
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
      // normalize features as array in DB
      payload.features = form.features
        ? form.features.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      if (imageFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'ministries', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      if (isEdit) {
        const { error } = await supabase.from('ministries').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Ministry updated' });
      } else {
        const { error } = await supabase.from('ministries').insert([payload]);
        if (error) throw error;
        toast({ title: 'Ministry created' });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input name="subtitle" value={form.subtitle} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Leader</label>
          <input name="leader" value={form.leader} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Time</label>
          <input name="meetingTime" value={form.meetingTime} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Gradient (Tailwind)</label>
          <input name="color" value={form.color} onChange={updateField} placeholder="from-blue-600 to-purple-600" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <input type="number" name="order" value={form.order} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
        <input name="features" value={form.features} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Ministry' : 'Create Ministry')}</Button>
      </div>
    </form>
  );
};

export default MinistryForm; 