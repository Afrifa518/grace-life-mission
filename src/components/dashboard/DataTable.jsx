import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DataTable = ({ 
  data, 
  columns, 
  title, 
  onEdit, 
  onDelete, 
  onView,
  searchPlaceholder = "Search...",
  filterOptions = [],
  // Server-mode props (optional)
  serverMode = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  searchTerm: externalSearch = '',
  onSearchChange,
  filterValue: externalFilter = 'all',
  onFilterChange,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const effectiveSearch = serverMode ? externalSearch : searchTerm;
  const effectiveFilter = serverMode ? externalFilter : filterValue;

  const filteredData = serverMode ? data : data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      (value ?? '').toString().toLowerCase().includes(effectiveSearch.toLowerCase())
    );
    const matchesFilter = effectiveFilter === 'all' || item.status === effectiveFilter || item.category === effectiveFilter;
    return matchesSearch && matchesFilter;
  });

  const totalItems = serverMode ? total : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handleSearchInput = (val) => {
    if (serverMode) onSearchChange?.(val);
    else setSearchTerm(val);
  };

  const handleFilterChange = (val) => {
    if (serverMode) onFilterChange?.(val);
    else setFilterValue(val);
  };

  const goPrev = () => {
    if (serverMode) onPageChange?.(Math.max(1, currentPage - 1));
  };
  const goNext = () => {
    if (serverMode) onPageChange?.(Math.min(totalPages, currentPage + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border/60 transition-shadow duration-300 hover:shadow-black/30"
    >
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={effectiveSearch}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-input/80 bg-background/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          {filterOptions.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={effectiveFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2.5 border border-input/80 bg-background/60 text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="all">All</option>
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-accent/30 transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(item)}
                          className="p-2 bg-background/30"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(item)}
                          className="p-2 bg-background/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(item)}
                          className="p-2 bg-background/30 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(!isLoading && filteredData.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data found matching your criteria.</p>
        </div>
      )}

      {serverMode && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} · {totalItems} total
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={currentPage <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goNext} disabled={currentPage >= totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;