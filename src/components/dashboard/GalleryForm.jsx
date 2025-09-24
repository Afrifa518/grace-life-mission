import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/galleryData';
import { uploadToStorage } from '@/lib/utils';

const defaultItem = {
  title: '',
  category: categories[1] || 'Worship',
  date: '',
  description: '',
  type: 'photo',
  testimony: '',
  status: 'published',
  imageUrl: '',
};

const GalleryForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultItem);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        category: initialData.category || (categories[1] || 'Worship'),
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        description: initialData.description || '',
        type: initialData.type || 'photo',
        testimony: initialData.testimony || '',
        status: initialData.status || 'published',
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
        const { publicUrl } = await uploadToStorage({ bucket: 'gallery', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      if (isEdit) {
        const { error } = await supabase.from('gallery').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Gallery item updated' });
      } else {
        const { error } = await supabase.from('gallery').insert([payload]);
        if (error) throw error;
        toast({ title: 'Gallery item created' });
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
          <input type="date" name="date" value={form.date} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="category" value={form.category} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            {categories.slice(1).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select name="type" value={form.type} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="photo">Photo</option>
            <option value="story">Story</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      {form.type === 'story' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Testimony</label>
          <textarea name="testimony" value={form.testimony} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Create Item')}</Button>
      </div>
    </form>
  );
};

export default GalleryForm; 