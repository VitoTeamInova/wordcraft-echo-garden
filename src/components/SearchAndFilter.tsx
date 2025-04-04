
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNeologism } from '@/context/NeologismContext';

interface SearchAndFilterProps {
  onSearch: (results: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export function SearchAndFilter({ onSearch, onCategoryChange }: SearchAndFilterProps) {
  const { categories } = useNeologism();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:w-2/3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search neologisms..."
          className="pl-8 bg-white"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Select onValueChange={handleCategoryChange} defaultValue="all">
        <SelectTrigger className="w-full md:w-1/3 bg-white">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
