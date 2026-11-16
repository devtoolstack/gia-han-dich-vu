import React from 'react';
import { FilterStatus, SortOption } from '../types';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface SubscriptionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6 space-y-3">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ, ghi chú..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="nearest">Hạn gần nhất</option>
            <option value="farthest">Hạn xa nhất</option>
            <option value="price-desc">Chi phí: Cao đến thấp</option>
            <option value="price-asc">Chi phí: Thấp đến cao</option>
            <option value="name">Tên (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center space-x-1 overflow-x-auto pt-3 border-t border-slate-100 pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Trạng thái:
        </span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'urgent', label: 'Cần chú ý (<=7d)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id as FilterStatus)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedStatus === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
