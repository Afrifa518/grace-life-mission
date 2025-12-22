import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const defaultLeader = {
  name: '',
  role: '',
  order: 0,
  bio: '',
  status: 'published',
  imageUrl: '',
};

const LeaderForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultLeader);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        role: initialData.role || '',
        order: initialData.order || 0,
        bio: initialData.bio || '',
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
        const { publicUrl } = await uploadToStorage({ bucket: 'leaders', file: imageFile, folder: 'images' });
        payload.imageUrl = publicUrl;
      }

      if (isEdit) {
        const { error } = await supabase.from('leaders').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Leader updated' });
      } else {
        const { error } = await supabase.from('leaders').insert([payload]);
        if (error) throw error;
        toast({ title: 'Leader created' });
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
          <label className="block text-sm font-medium text-foreground/80 mb-2">Name</label>
          <input name="name" value={form.name} onChange={updateField} required className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Role</label>
          <input name="role" value={form.role} onChange={updateField} required className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Order</label>
          <input type="number" name="order" value={form.order} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Status</label>
          <select name="status" value={form.status} onChange={updateField} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-2">Bio</label>
        <textarea name="bio" value={form.bio} onChange={updateField} rows={4} className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Leader' : 'Create Leader')}</Button>
      </div>
    </form>
  );
};

export default LeaderForm; 