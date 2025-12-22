import React, { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import StaffForm from '@/components/dashboard/StaffForm';
import { supabase } from '@/lib/supabase';

const StaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // server-mode state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('staff_members')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true })
        .order('name', { ascending: true });

      if (search) {
        query = query.or(`name.ilike.%${search}%,role.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        if (filter === 'published' || filter === 'draft') {
          query = query.eq('status', filter);
        }
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;

      setStaff(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching staff', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);

  const handleAddNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', item.id)
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Delete did not affect any rows. Check RLS policies and ID.');

      toast({ title: 'Staff Deleted', description: `"${item.name}" has been removed.` });
      fetchStaff();
    } catch (err) {
      toast({ title: 'Error deleting staff', description: err.message, variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div className="max-w-xs">
          <p className="font-medium text-foreground truncate">{value}</p>
          <p className="text-xs text-muted-foreground truncate">{item.role || '—'}</p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value || '—'}</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value || '—'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          value === 'published'
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
            : 'bg-amber-500/15 text-amber-300 border-amber-500/20'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'order',
      label: 'Order',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{typeof value === 'number' ? value : '—'}</span>
      )
    }
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Staff</h2>
          <p className="text-muted-foreground mt-2">Manage staff members shown on the Contact page.</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Tip: Use status “Published” to show on the public site.</span>
      </div>

      <DataTable
        data={staff}
        columns={columns}
        title="All Staff"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={undefined}
        searchPlaceholder="Search staff..."
        filterOptions={filterOptions}
        serverMode
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        searchTerm={search}
        onSearchChange={(v) => { setPage(1); setSearch(v); }}
        filterValue={filter}
        onFilterChange={(v) => { setPage(1); setFilter(v); }}
        isLoading={loading}
      />

      <Modal open={open} title={editing ? 'Edit Staff' : 'Add Staff'} onClose={() => setOpen(false)}>
        <StaffForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchStaff(); }}
        />
      </Modal>
    </div>
  );
};

export default StaffManagement;
