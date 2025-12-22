import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const defaultSermon = {
  title: '',
  speaker: '',
  date: '',
  duration: '',
  description: '',
  status: 'draft',
  youtubeUrl: '',
  imageUrl: '',
};

const SermonForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultSermon);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        speaker: initialData.speaker || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        duration: initialData.duration || '',
        description: initialData.description || '',
        status: initialData.status || 'draft',
        youtubeUrl: initialData.youtubeUrl || initialData.audioUrl || '',
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
        const { publicUrl } = await uploadToStorage({ bucket: 'sermons', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      delete payload.audioUrl;

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
          <label className="block text-sm font-medium text-foreground/80 mb-2">Title</label>
          <input name="title" value={form.title} onChange={updateField} required className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Speaker</label>
          <input name="speaker" value={form.speaker} onChange={updateField} required className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Date</label>
          <input type="date" name="date" value={form.date} onChange={updateField} required className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Duration</label>
          <input name="duration" placeholder="e.g. 40 min" value={form.duration} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">YouTube URL</label>
          <input name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={form.youtubeUrl} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={updateField} rows={4} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Sermon' : 'Create Sermon')}</Button>
      </div>
    </form>
  );
};

export default SermonForm; 