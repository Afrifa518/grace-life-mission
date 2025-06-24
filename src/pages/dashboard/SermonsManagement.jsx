import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { sermonCategories } from '@/data/sermonsData';
import { supabase } from '@/lib/supabase';

const SermonsManagement = () => {
  const { toast } = useToast();
  const [sermons, setSermons] = useState([]);

  useEffect(() => {
    const fetchSermons = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('sermons').select('*').order('date', { ascending: false });
      if (error) {
        toast({ title: "Error fetching sermons", description: error.message, variant: 'destructive' });
      } else {
        setSermons(data);
      }
    };
    fetchSermons();
  }, [toast]);
  
  const handleEdit = (sermon) => {
    toast({
      title: "🚧 Edit Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDelete = async (sermonToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('sermons').delete().eq('id', sermonToDelete.id);
    
    if (error) {
      toast({ title: "Error deleting sermon", description: error.message, variant: 'destructive' });
    } else {
      setSermons(sermons.filter(s => s.id !== sermonToDelete.id));
      toast({
        title: "Sermon Deleted",
        description: `"${sermonToDelete.title}" has been removed.`,
      });
    }
  };

  const handleView = (sermon) => {
    toast({
      title: "🚧 View Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleAddNew = () => {
    toast({
      title: "🚧 Add Sermon Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
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
      />
    </div>
  );
};

export default SermonsManagement;