import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image, Heart, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/dashboard/Modal';
import GalleryForm from '@/components/dashboard/GalleryForm';

const GalleryManagement = () => {
  const { toast } = useToast();
  const [gallery, setGallery] = useState([]);
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

  const fetchGallery = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('gallery')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (filter && filter !== 'all') {
        if (filter === 'photo' || filter === 'story' || filter === 'video') {
          query = query.eq('type', filter);
        }
      }

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      setGallery(data || []);
      setTotal(count || 0);
    } catch (err) {
      toast({ title: 'Error fetching gallery', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filter]);

  const handleEdit = (item) => {
    setEditing(item);
    setOpen(true);
  };

  const handleDelete = async (itemToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('gallery').delete().eq('id', itemToDelete.id);
    if (error) {
      toast({ title: 'Error deleting item', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Gallery Item Deleted', description: `"${itemToDelete.title}" has been removed.` });
      fetchGallery();
    }
  };

  const handleView = (item) => {
    setViewing(item);
  };

  const handleAddNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{item.type}</p>
          </div>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'video' ? (
            <Heart className="w-4 h-4 text-purple-600" />
          ) : (
            <Star className="w-4 h-4 text-green-600" />
          )}
          <span className="text-sm text-gray-600 capitalize">{value}</span>
        </div>
      )
    }
  ];

  const filterOptions = [
    { value: 'photo', label: 'Photos' },
    { value: 'video', label: 'Videos' },
  ];

  const getYouTubeId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/embed/')) return u.pathname.split('/').pop();
        const id = u.searchParams.get('v');
        if (id) return id;
      }
    } catch {}
    return '';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600 mt-2">Manage photos, testimonies, and visual content.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <DataTable
        data={gallery}
        columns={columns}
        title="Gallery Items"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search gallery items..."
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

      <Modal open={open} title={editing ? 'Edit Gallery Item' : 'Upload Content'} onClose={() => setOpen(false)}>
        <GalleryForm
          initialData={editing}
          onCancel={() => setOpen(false)}
          onSaved={async () => { setOpen(false); await fetchGallery(); }}
        />
      </Modal>

      {viewing && (
        <Modal open={true} title={viewing.title} onClose={() => setViewing(null)}>
          <div className="space-y-4">
            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100">
              {viewing.type === 'video' && viewing.youtubeUrl ? (
                <iframe
                  className="w-full h-full"
                  src={(() => { const id = getYouTubeId(viewing.youtubeUrl); return id ? `https://www.youtube.com/embed/${id}` : viewing.youtubeUrl; })()}
                  title={viewing.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <img
                  src={viewing.imageUrl || 'https://images.unsplash.com/photo-1595872018818-97555653a011'}
                  alt={viewing.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Type:</span>
                <div className="capitalize">{viewing.type || '—'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-900">Date:</span>
                <div>{viewing.date ? new Date(viewing.date).toLocaleDateString() : '—'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-900">Status:</span>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  viewing.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{viewing.status}</div>
              </div>
              {viewing.type === 'video' && viewing.youtubeUrl && (
                <div>
                  <span className="font-medium text-gray-900">YouTube:</span>
                  <div>
                    <a href={viewing.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open link</a>
                  </div>
                </div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-900">Description:</span>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{viewing.description || '—'}</p>
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

export default GalleryManagement;