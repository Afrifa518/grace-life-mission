import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { eventCategories } from '@/data/eventsData';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import EventForm from '@/components/dashboard/EventForm';

const EventsManagement = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // server-mode state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        if (filter === 'published' || filter === 'draft') {
          query = query.eq('status', filter);
        } else {
          query = query.eq('category', filter);
        }
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setEvents(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching events', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);

  const handleEdit = (event) => {
    setEditing(event);
    setOpen(true);
  };

  const handleDelete = async (eventToDelete) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete.id)
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Delete did not affect any rows. Check RLS policies and ID.');

      toast({ title: 'Event Deleted', description: `"${eventToDelete.title}" has been removed.` });
      fetchEvents();
    } catch (err) {
      toast({ title: 'Error deleting event', description: err.message, variant: 'destructive' });
    }
  };

  const handleView = (event) => {
    setViewing(event);
  };

  const handleAddNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const columns = [
    {
      key: 'title',
      label: 'Event Title',
      render: (value) => (
        <div className="max-w-xs">
          <p className="font-medium text-foreground truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {item.schedule?.length ? new Date(item.schedule[0].date).toLocaleDateString() : new Date(value).toLocaleDateString()}
          </span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-sky-500/15 text-sky-300 border-sky-500/20">
          {value}
        </span>
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
    }
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    ...eventCategories.map(cat => ({ value: cat, label: cat }))
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Events Management</h2>
          <p className="text-muted-foreground mt-2">Manage church events, registrations, and scheduling.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <DataTable
        data={events}
        columns={columns}
        title="All Events"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search events..."
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

      <Modal open={open} title={editing ? 'Edit Event' : 'Create Event'} onClose={() => setOpen(false)}>
        <EventForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchEvents(); }}
        />
      </Modal>

      {viewing && (
        <Modal open={true} title={viewing.title} onClose={() => setViewing(null)}>
          <div className="space-y-4">
            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-muted/40">
              <img
                src={viewing.imageUrl || '/sunday.jpeg'}
                alt={viewing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Schedule:</span>
                <div className="mt-1 space-y-1">
                  {(viewing.schedule && viewing.schedule.length ? viewing.schedule : [{ date: viewing.date, time: viewing.time }]).map((s, i) => (
                    <div key={i}>{s.date ? new Date(s.date).toLocaleDateString() : '—'}{s.time ? ` · ${s.time}` : ''}</div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-foreground">Location:</span>
                <div>{viewing.location || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Category:</span>
                <div>{viewing.category || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Recurring:</span>
                <div>{viewing.recurring || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Status:</span>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  viewing.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                }`}>{viewing.status}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Created:</span>
                <div>{viewing.created_at ? new Date(viewing.created_at).toLocaleString() : '—'}</div>
              </div>
            </div>
            <div>
              <span className="font-medium text-foreground">Description:</span>
              <p className="mt-1 text-muted-foreground whitespace-pre-line">{viewing.description || '—'}</p>
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

export default EventsManagement;