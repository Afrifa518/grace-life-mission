import React, { useEffect, useState } from 'react';
import { Plus, UserSquare2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import LeaderForm from '@/components/dashboard/LeaderForm';

const LeadersManagement = () => {
  const { toast } = useToast();
  const [leaders, setLeaders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchLeaders = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('leaders')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true })
        .order('name', { ascending: true });

      if (search) {
        query = query.or(`name.ilike.%${search}%,role.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setLeaders(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching leaders', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);

  const handleEdit = (leader) => {
    setEditing(leader);
    setOpen(true);
  };

  const handleDelete = async (leaderToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('leaders').delete().eq('id', leaderToDelete.id);
    if (error) {
      toast({ title: 'Error deleting leader', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Leader Deleted', description: `"${leaderToDelete.name}" has been removed.` });
      fetchLeaders();
    }
  };

  const handleAddNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted/40 rounded-xl flex items-center justify-center border border-border/60">
            <UserSquare2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{item.role}</p>
          </div>
        </div>
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
  ];

  const filterOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Leadership</h2>
          <p className="text-muted-foreground mt-2">Manage church leadership team.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leader
        </Button>
      </div>

      <DataTable
        data={leaders}
        columns={columns}
        title="All Leaders"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={undefined}
        searchPlaceholder="Search leaders..."
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

      <Modal open={open} title={editing ? 'Edit Leader' : 'Add Leader'} onClose={() => setOpen(false)}>
        <LeaderForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchLeaders(); }}
        />
      </Modal>
    </div>
  );
};

export default LeadersManagement; 