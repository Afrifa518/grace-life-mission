import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import MinistryForm from '@/components/dashboard/MinistryForm';

const MinistriesManagement = () => {
  const { toast } = useToast();
  const [ministries, setMinistries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // server-mode state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchMinistries = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('ministries')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true })
        .order('title', { ascending: true });

      if (search) {
        query = query.or(`title.ilike.%${search}%,leader.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setMinistries(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching ministries', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);

  const handleEdit = (ministry) => {
    setEditing(ministry);
    setOpen(true);
  };

  const handleDelete = async (ministryToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('ministries').delete().eq('id', ministryToDelete.id);
    if (error) {
      toast({ title: 'Error deleting ministry', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Ministry Deleted', description: `"${ministryToDelete.title}" has been removed.` });
      fetchMinistries();
    }
  };

  const handleView = (ministry) => {
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
      label: 'Ministry',
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{item.subtitle}</p>
          </div>
        </div>
      )
    },
    {
      key: 'leader',
      label: 'Leader',
      render: (value) => (
        <span className="text-sm text-gray-600">{value || '—'}</span>
      )
    },
    {
      key: 'meetingTime',
      label: 'Meets',
      render: (value) => (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{value || '—'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ministries Management</h2>
          <p className="text-gray-600 mt-2">Create and manage church ministries.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Ministry
        </Button>
      </div>

      <DataTable
        data={ministries}
        columns={columns}
        title="All Ministries"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search ministries..."
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

      <Modal open={open} title={editing ? 'Edit Ministry' : 'Add Ministry'} onClose={() => setOpen(false)}>
        <MinistryForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchMinistries(); }}
        />
      </Modal>
    </div>
  );
};

export default MinistriesManagement; 