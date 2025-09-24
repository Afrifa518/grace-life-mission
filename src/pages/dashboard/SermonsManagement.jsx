import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { sermonCategories } from '@/data/sermonsData';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import SermonForm from '@/components/dashboard/SermonForm';

const SermonsManagement = () => {
  const { toast } = useToast();
  const [sermons, setSermons] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
    toast({
      title: '🚧 View Feature Coming Soon!',
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
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
          <p className="font-medium text-gray-900 truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'speaker',
      label: 'Speaker',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
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
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{value || 0}</span>
        </div>
      )
    }
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    ...sermonCategories.map(cat => ({ value: cat, label: cat }))
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sermons Management</h2>
          <p className="text-gray-600 mt-2">Manage your sermon library and audio/video content.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
    </div>
  );
};

export default SermonsManagement;