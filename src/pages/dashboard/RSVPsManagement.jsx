import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import { supabase } from '@/lib/supabase';

const RSVPsManagement = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [viewing, setViewing] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('event_rsvps')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(
          `event_title.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`
        );
      }

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setItems(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching RSVPs', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize, search, filter]);

  const handleView = (item) => setViewing(item);

  const handleDelete = async (item) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('id', item.id)
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Delete did not affect any rows. Check RLS policies and ID.');

      toast({ title: 'Deleted', description: 'RSVP deleted.' });
      fetchItems();
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'event_title',
      label: 'Event',
      render: (value) => <span className="text-sm font-medium text-foreground">{value || '—'}</span>,
    },
    {
      key: 'event_date',
      label: 'Event Date',
      render: (value) => <span className="text-sm text-muted-foreground">{value ? new Date(value).toLocaleDateString() : '—'}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (value) => <span className="text-sm text-muted-foreground">{value}</span>,
    },
    {
      key: 'guests',
      label: 'Guests',
      render: (value) => <span className="text-sm text-muted-foreground">{value || 1}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          value === 'resolved'
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
            : 'bg-amber-500/15 text-amber-300 border-amber-500/20'
        }`}>
          {value || 'new'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (value) => <span className="text-sm text-muted-foreground">{value ? new Date(value).toLocaleString() : '—'}</span>,
    },
  ];

  const filterOptions = [
    { value: 'new', label: 'New' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Event RSVPs</h2>
        <p className="text-muted-foreground mt-2">RSVP submissions from the Events page.</p>
      </div>

      <DataTable
        data={items}
        columns={columns}
        title="All RSVPs"
        onEdit={undefined}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search RSVPs..."
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

      {viewing && (
        <Modal open={true} title={`RSVP: ${viewing.event_title || ''}`} onClose={() => setViewing(null)}>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-foreground">Name</div>
                <div>{viewing.name}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Email</div>
                <div>{viewing.email}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Phone</div>
                <div>{viewing.phone || '—'}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Guests</div>
                <div>{viewing.guests || 1}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Event Date</div>
                <div>{viewing.event_date ? new Date(viewing.event_date).toLocaleDateString() : '—'}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Submitted</div>
                <div>{viewing.created_at ? new Date(viewing.created_at).toLocaleString() : '—'}</div>
              </div>
            </div>

            <div>
              <div className="font-medium text-foreground">Message</div>
              <p className="mt-1 whitespace-pre-line">{viewing.message || '—'}</p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RSVPsManagement;
