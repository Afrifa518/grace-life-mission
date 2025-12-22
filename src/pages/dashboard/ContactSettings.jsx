import React, { useEffect, useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import ChurchInfoForm from '@/components/dashboard/ChurchInfoForm';
import ServiceTimeForm from '@/components/dashboard/ServiceTimeForm';

const ContactSettings = () => {
  const { toast } = useToast();
  const [churchInfo, setChurchInfo] = useState(null);
  const [churchLoading, setChurchLoading] = useState(false);

  const [serviceTimes, setServiceTimes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // server-mode state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchChurchInfo = async () => {
    if (!supabase) return;
    setChurchLoading(true);
    try {
      const { data, error } = await supabase
        .from('church_info')
        .select('*')
        .eq('slug', 'default')
        .limit(1);

      if (error) throw error;
      setChurchInfo((data && data[0]) || null);
    } catch (err) {
      toast({ title: 'Error fetching church info', description: err.message, variant: 'destructive' });
      setChurchInfo(null);
    } finally {
      setChurchLoading(false);
    }
  };

  const fetchServiceTimes = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('service_times')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true })
        .order('day', { ascending: true });

      if (search) {
        query = query.or(`day.ilike.%${search}%,times.ilike.%${search}%,special.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        if (filter === 'published' || filter === 'draft') {
          query = query.eq('status', filter);
        }
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;

      setServiceTimes(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching service times', description: err.message, variant: 'destructive' });
      setServiceTimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChurchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchServiceTimes();
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
        .from('service_times')
        .delete()
        .eq('id', item.id)
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Delete did not affect any rows. Check RLS policies and ID.');

      toast({ title: 'Service time deleted', description: `"${item.day}" has been removed.` });
      fetchServiceTimes();
    } catch (err) {
      toast({ title: 'Error deleting service time', description: err.message, variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'day',
      label: 'Day',
      render: (value) => <span className="text-sm text-foreground font-medium">{value}</span>,
    },
    {
      key: 'times',
      label: 'Times',
      render: (value) => <span className="text-sm text-muted-foreground">{value}</span>,
    },
    {
      key: 'special',
      label: 'Special',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>,
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
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value) => <span className="text-sm text-muted-foreground">{typeof value === 'number' ? value : '—'}</span>,
    },
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Contact Settings</h2>
          <p className="text-muted-foreground mt-2">Manage church contact details and service times shown on the public site.</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Public-facing settings</span>
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border/60 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Church Info</h3>
        {churchLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <ChurchInfoForm initialData={churchInfo} onSaved={fetchChurchInfo} />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Service Times</h3>
            <p className="text-sm text-muted-foreground">Add, edit, and publish service times for the Contact page.</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service Time
          </Button>
        </div>

        <DataTable
          data={serviceTimes}
          columns={columns}
          title="All Service Times"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={undefined}
          searchPlaceholder="Search service times..."
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

        <Modal open={open} title={editing ? 'Edit Service Time' : 'Add Service Time'} onClose={() => setOpen(false)}>
          <ServiceTimeForm
            initialData={editing}
            onCancel={() => setOpen(false)}
            onSaved={async () => { setOpen(false); await fetchServiceTimes(); }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ContactSettings;
