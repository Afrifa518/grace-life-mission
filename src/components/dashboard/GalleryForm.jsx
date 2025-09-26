import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const defaultItem = {
  title: '',
  date: '',
  description: '',
  type: 'photo',
  status: 'published',
  imageUrl: '',
  youtubeUrl: '',
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
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        description: initialData.description || '',
        type: initialData.type || 'photo',
        status: initialData.status || 'published',
        imageUrl: initialData.imageUrl || '',
        youtubeUrl: initialData.youtubeUrl || '',
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

      if (payload.type === 'video') {
        // For video, image is optional; ensure youtubeUrl is provided
        if (!payload.youtubeUrl) {
          throw new Error('Please provide a YouTube URL for video items.');
        }
      } else {
        // For photo, ensure an image (existing or newly uploaded)
        if (!payload.imageUrl && !imageFile) {
          throw new Error('Please upload an image for photo items.');
        }
      }

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select name="type" value={form.type} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="photo">Photo</option>
            <option value="video">YouTube Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        {form.type === 'photo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
          </div>
        )}
        {form.type === 'video' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={form.youtubeUrl} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={updateField} rows={4} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Create Item')}</Button>
      </div>
    </form>
  );
};

export default GalleryForm; 