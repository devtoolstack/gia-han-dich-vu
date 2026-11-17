import React, { useState, useEffect } from 'react';
import { Subscription, FilterStatus, SortOption } from './types';
import { INITIAL_SUBSCRIPTIONS, DEFAULT_USD_TO_VND, getDaysLeft } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { DashboardSummary } from './components/DashboardSummary';
import { AlertBanner } from './components/AlertBanner';
import { SubscriptionFilters } from './components/SubscriptionFilters';
import { SubscriptionTable } from './components/SubscriptionTable';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ExportImportModal } from './components/ExportImportModal';
import { NotificationModal } from './components/NotificationModal';
import { Inbox, Plus } from 'lucide-react';

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subtracker_subscriptions_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse subscriptions from localStorage', e);
      }
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('subtracker_exchangerate_v1');
    return saved ? parseFloat(saved) : DEFAULT_USD_TO_VND;
  });

  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nearest');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('subtracker_subscriptions_v3', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('subtracker_exchangerate_v1', exchangeRate.toString());
  }, [exchangeRate]);

  // Delete Handler
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  // Save Add/Edit
  const handleSaveSubscription = (data: Omit<Subscription, 'id'> & { id?: string }) => {
    if (data.id) {
      setSubscriptions(prev =>
        prev.map(s => (s.id === data.id ? { ...s, ...data } : s))
      );
    } else {
      const newSub: Subscription = {
        ...data,
        id: `sub-${Date.now()}`,
      };
      setSubscriptions(prev => [newSub, ...prev]);
    }
  };

  const handleResetData = () => {
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
  };

  // Filter and Sort Subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      sub.name.toLowerCase().includes(query) ||
      (sub.notes && sub.notes.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (selectedStatus === 'urgent') {
      const days = getDaysLeft(sub.renewalDate);
      return days <= 7;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'nearest') {
      return getDaysLeft(a.renewalDate) - getDaysLeft(b.renewalDate);
    } else if (sortBy === 'farthest') {
      return getDaysLeft(b.renewalDate) - getDaysLeft(a.renewalDate);
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Navbar */}
      <Navbar
        onAddClick={() => {
          setEditingSubscription(null);
          setIsModalOpen(true);
        }}
        onExportClick={() => setIsExportImportOpen(true)}
        onImportClick={() => setIsExportImportOpen(true)}
        onNotificationClick={() => setIsNotificationModalOpen(true)}
        onResetData={handleResetData}
        exchangeRate={exchangeRate}
        onUpdateExchangeRate={(rate) => setExchangeRate(rate)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Dashboard Summary Stats */}
        <DashboardSummary subscriptions={subscriptions} exchangeRate={exchangeRate} />

        {/* Alert Banner for Urgent Renewals */}
        <AlertBanner
          subscriptions={subscriptions}
          exchangeRate={exchangeRate}
          onSelectSub={(sub) => {
            setEditingSubscription(sub);
            setIsModalOpen(true);
          }}
        />

        {/* Search & Filter Controls */}
        <SubscriptionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Subscriptions Table */}
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-6">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Chưa có dịch vụ nào</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Bắt đầu thêm dịch vụ đầu tiên của bạn để quản lý chi phí và thời gian gia hạn.
            </p>
            <button
              onClick={() => {
                setEditingSubscription(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dịch vụ ngay</span>
            </button>
          </div>
        ) : (
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            exchangeRate={exchangeRate}
            onEdit={(s) => {
              setEditingSubscription(s);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">SubTracker</span>
            <span>&bull;</span>
            <span>Quản lý đăng ký dịch vụ & gia hạn</span>
          </div>
          <p>Dữ liệu được lưu trữ tự động trên trình duyệt (LocalStorage).</p>
        </div>
      </footer>

      {/* Add / Edit Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubscription(null);
        }}
        onSave={handleSaveSubscription}
        editingSubscription={editingSubscription}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        subscriptions={subscriptions}
        onImportData={(imported) => {
          setSubscriptions(imported);
        }}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
