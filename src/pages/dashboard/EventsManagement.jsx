import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/dashboard/DataTable';
import { eventCategories } from '@/data/eventsData';
import { supabase } from '@/lib/supabase';

const EventsManagement = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      if (error) {
        toast({ title: "Error fetching events", description: error.message, variant: 'destructive' });
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, [toast]);

  const handleEdit = (event) => {
    toast({
      title: "🚧 Edit Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDelete = async (eventToDelete) => {
    if (!supabase) return;
    const { error } = await supabase.from('events').delete().eq('id', eventToDelete.id);
    if (error) {
      toast({ title: "Error deleting event", description: error.message, variant: 'destructive' });
    } else {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete.title}" has been removed.`,
      });
    }
  };

  const handleView = (event) => {
    toast({
      title: "🚧 View Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleAddNew = () => {
    toast({
      title: "🚧 Add Event Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const columns = [
    {
      key: 'title',
      label: 'Event Title',
      render: (value) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{value}</span>
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
          <h2 className="text-3xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600 mt-2">Manage church events, registrations, and scheduling.</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
      />
    </div>
  );
};

export default EventsManagement;