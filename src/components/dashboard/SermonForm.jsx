import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { sermonCategories } from '@/data/sermonsData';
import { uploadToStorage } from '@/lib/utils';

const defaultSermon = {
  title: '',
  speaker: '',
  date: '',
  duration: '',
  category: sermonCategories[0],
  description: '',
  status: 'draft',
  audioUrl: '',
  imageUrl: '',
};

const SermonForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultSermon);
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        speaker: initialData.speaker || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        duration: initialData.duration || '',
        category: initialData.category || sermonCategories[0],
        description: initialData.description || '',
        status: initialData.status || 'draft',
        audioUrl: initialData.audioUrl || '',
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

      // Upload files if provided
      if (audioFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'sermons', file: audioFile, folder: 'audio' });
        payload.audioUrl = publicUrl;
      }
      if (imageFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'sermons', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      if (isEdit) {
        const { error } = await supabase
          .from('sermons')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Sermon updated' });
      } else {
        const { error } = await supabase
          .from('sermons')
          .insert([payload]);
        if (error) throw error;
        toast({ title: 'Sermon created' });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
          <input name="speaker" value={form.speaker} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input type="date" name="date" value={form.date} onChange={updateField} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input name="duration" placeholder="e.g. 40 min" value={form.duration} onChange={updateField} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="category" value={form.category} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            {sermonCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-3 py-2 border rounded-lg">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Audio (optional)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="w-full" />
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Sermon' : 'Create Sermon')}</Button>
      </div>
    </form>
  );
};

export default SermonForm; 