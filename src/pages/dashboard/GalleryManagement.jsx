import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image, Heart, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { categories } from '@/data/galleryData';
import { supabase } from '@/lib/supabase';

const GalleryManagement = () => {
  const { toast } = useToast();
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
      if (error) {
        toast({ title: "Error fetching gallery", description: error.message, variant: 'destructive' });
      } else {
        setGallery(data);
      }
    };
    fetchGallery();
  }, [toast]);

  const handleEdit = (item) => {
    toast({
      title: "🚧 Edit Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDelete = async (itemToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('gallery').delete().eq('id', itemToDelete.id);
    if (error) {
      toast({ title: "Error deleting item", description: error.message, variant: 'destructive' });
    } else {
      setGallery(gallery.filter(item => item.id !== itemToDelete.id));
      toast({
        title: "Gallery Item Deleted",
        description: `"${itemToDelete.title}" has been removed.`,
      });
    }
  };

  const handleView = (item) => {
    toast({
      title: "🚧 View Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleAddNew = () => {
    toast({
      title: "🚧 Upload Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
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
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
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
          {value === 'story' ? (
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
    { value: 'story', label: 'Stories' },
    ...categories.slice(1).map(cat => ({ value: cat, label: cat }))
  ];

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
      />
    </div>
  );
};

export default GalleryManagement;