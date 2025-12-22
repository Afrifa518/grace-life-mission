import React, { useState, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import SermonForm from '@/components/dashboard/SermonForm';

const SermonsManagement = () => {
  const { toast } = useToast();
  const [sermons, setSermons] = useState([]);
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

  const fetchSermons = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('sermons')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,speaker.ilike.%${search}%`);
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
      setSermons(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching sermons', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);
  
  const handleEdit = (sermon) => {
    setEditing(sermon);
    setOpen(true);
  };

  const handleDelete = async (sermonToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('sermons').delete().eq('id', sermonToDelete.id);
    
    if (error) {
      toast({ title: 'Error deleting sermon', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sermon Deleted', description: `"${sermonToDelete.title}" has been removed.` });
      fetchSermons();
    }
  };

  const handleView = (sermon) => {
    setViewing(sermon);
  };

  const handleAddNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value) => (
        <div className="max-w-xs">
          <p className="font-medium text-foreground truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'speaker',
      label: 'Speaker',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
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
    },
    {
      key: 'views',
      label: 'Views',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{value || 0}</span>
        </div>
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
          <h2 className="text-3xl font-bold text-foreground">Sermons Management</h2>
          <p className="text-muted-foreground mt-2">Manage your sermon library and audio/video content.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Sermon
        </Button>
      </div>

      <DataTable
        data={sermons}
        columns={columns}
        title="All Sermons"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search sermons..."
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

      <Modal open={open} title={editing ? 'Edit Sermon' : 'Add Sermon'} onClose={() => setOpen(false)}>
        <SermonForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchSermons(); }}
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
                <span className="font-medium text-foreground">Speaker:</span>
                <div>{viewing.speaker || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Date:</span>
                <div>{viewing.date ? new Date(viewing.date).toLocaleDateString() : '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Duration:</span>
                <div>{viewing.duration || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Category:</span>
                <div>{viewing.category || '—'}</div>
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
                <span className="font-medium text-foreground">YouTube:</span>
                <div>
                  {viewing.youtubeUrl ? (
                    <a href={viewing.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open link</a>
                  ) : '—'}
                </div>
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

export default SermonsManagement;