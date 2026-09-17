'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface SearchToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick?: () => void;
  onClear?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export function SearchToolbar({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onClear,
  placeholder = 'Search...',
  showFilter = true,
}: SearchToolbarProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showFilter && onFilterClick && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      )}
    </div>
  );
}