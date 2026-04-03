import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const defaultStaff = {
  name: '',
  role: '',
  email: '',
  phone: '',
  specialties: '',
  status: 'published',
  order: 0,
  image_url: '',
};

const StaffForm = ({ initialData, onCancel, onSaved }) => {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(defaultStaff);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        role: initialData.role || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        specialties: Array.isArray(initialData.specialties)
          ? initialData.specialties.join(', ')
          : (initialData.specialties || ''),
        status: initialData.status || 'published',
        order: typeof initialData.order === 'number' ? initialData.order : (initialData.order || 0),
        image_url: initialData.image_url || '',
      });
    } else {
      setForm(defaultStaff);
    }
    setImageFile(null);
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
        name: form.name,
        role: form.role || null,
        email: form.email || null,
        phone: form.phone || null,
        specialties: form.specialties
          ? form.specialties.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        status: form.status || 'published',
        order: Number.isFinite(Number(form.order)) ? Number(form.order) : 0,
        image_url: form.image_url || null,
      };

      if (imageFile) {
        const { publicUrl } = await uploadToStorage({ bucket: 'staff', file: imageFile, folder: 'photos' });
        payload.image_url = publicUrl;
      }

      if (isEdit) {
        const { error } = await supabase
          .from('staff_members')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
        toast({ title: 'Staff updated' });
      } else {
        const { error } = await supabase
          .from('staff_members')
          .insert([payload]);
        if (error) throw error;
        toast({ title: 'Staff created' });
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
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Role</label>
          <input
            name="role"
            value={form.role}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Specialties (comma-separated)</label>
          <input
            name="specialties"
            value={form.specialties}
            onChange={updateField}
            className="w-full px-4 py-3 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground/80 mb-2">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {form.image_url && (
            <div className="mt-3">
              <img src={form.image_url} alt="Staff" className="h-16 w-16 rounded-full object-cover border border-border/60" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Staff' : 'Create Staff')}</Button>
      </div>
    </form>
  );
};

export default StaffForm;
