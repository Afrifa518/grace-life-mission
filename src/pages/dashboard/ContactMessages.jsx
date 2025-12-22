import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import { supabase } from '@/lib/supabase';

const ContactMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [viewing, setViewing] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
        );
      }

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setMessages(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching messages', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, pageSize, search, filter]);

  const handleView = (item) => setViewing(item);

  const handleDelete = async (item) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', item.id)
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Delete did not affect any rows. Check RLS policies and ID.');

      toast({ title: 'Deleted', description: 'Message deleted.' });
      fetchMessages();
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => <span className="text-sm text-foreground font-medium">{value}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-sm text-muted-foreground">{value}</span>,
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>,
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
      label: 'Received',
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
        <h2 className="text-3xl font-bold text-foreground">Contact Messages</h2>
        <p className="text-muted-foreground mt-2">Messages submitted from the Contact page.</p>
      </div>

      <DataTable
        data={messages}
        columns={columns}
        title="Inbox"
        onEdit={undefined}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search messages..."
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
        <Modal open={true} title={`Message from ${viewing.name}`} onClose={() => setViewing(null)}>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-foreground">Email</div>
                <div>{viewing.email}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Phone</div>
                <div>{viewing.phone || '—'}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Reason</div>
                <div>{viewing.visit_reason || '—'}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Received</div>
                <div>{viewing.created_at ? new Date(viewing.created_at).toLocaleString() : '—'}</div>
              </div>
            </div>

            <div>
              <div className="font-medium text-foreground">Subject</div>
              <div>{viewing.subject || '—'}</div>
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

export default ContactMessages;
