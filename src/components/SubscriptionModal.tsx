import React, { useState, useEffect } from 'react';
import { Subscription, Currency, BillingCycle } from '../types';
import { isoToDisplayDate, displayToIsoDate } from '../utils/helpers';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscriptionData: Omit<Subscription, 'id'> & { id?: string }) => void;
  editingSubscription?: Subscription | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('150000');
  const [currency, setCurrency] = useState<Currency>('VND');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [customMonths, setCustomMonths] = useState<number>(2);
  
  // Display string in DD/MM/YYYY format for user input
  const [lastRenewalDisplay, setLastRenewalDisplay] = useState<string>('');
  const [renewalDisplay, setRenewalDisplay] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    if (editingSubscription) {
      setName(editingSubscription.name);
      setPrice(editingSubscription.price.toString());
      setCurrency(editingSubscription.currency);
      setBillingCycle(editingSubscription.billingCycle);
      setCustomMonths(editingSubscription.customMonths || 2);
      setLastRenewalDisplay(isoToDisplayDate(editingSubscription.lastRenewalDate || todayIso));
      setRenewalDisplay(isoToDisplayDate(editingSubscription.renewalDate || todayIso));
      setNotes(editingSubscription.notes || '');
    } else {
      setName('');
      setPrice('150000');
      setCurrency('VND');
      setBillingCycle('monthly');
      setCustomMonths(2);
      setLastRenewalDisplay(isoToDisplayDate(todayIso));
      setRenewalDisplay(isoToDisplayDate(todayIso));
      setNotes('');
    }
  }, [editingSubscription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên dịch vụ!');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      alert('Chi phí không hợp lệ!');
      return;
    }

    const lastRenewalIso = displayToIsoDate(lastRenewalDisplay);
    const renewalIso = displayToIsoDate(renewalDisplay);

    onSave({
      id: editingSubscription ? editingSubscription.id : undefined,
      name: name.trim(),
      price: numPrice,
      currency,
      billingCycle,
      customMonths: billingCycle === 'custom' ? Number(customMonths) : undefined,
      lastRenewalDate: lastRenewalIso,
      renewalDate: renewalIso,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">
            {editingSubscription ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tên dịch vụ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: VPS Tino, Netflix, ChatGPT Plus..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" /> Chi phí
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="VD: 150000 hoặc 20"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Đơn vị
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-bold"
              >
                <option value="VND">VNĐ (đ)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Billing Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Chu kỳ thanh toán
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý (3 tháng)</option>
                <option value="yearly">Hàng năm</option>
                <option value="custom">Tùy chỉnh số tháng</option>
              </select>
            </div>

            {billingCycle === 'custom' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Số tháng chu kỳ
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Ngày gần nhất (DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  required
                  placeholder="DD/MM/YYYY (VD: 28/10/2026)"
                  value={lastRenewalDisplay}
                  onChange={(e) => setLastRenewalDisplay(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            )}
          </div>

          {billingCycle === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Ngày gần nhất (DD/MM/YYYY)
              </label>
              <input
                type="text"
                required
                placeholder="DD/MM/YYYY (VD: 28/10/2026)"
                value={lastRenewalDisplay}
                onChange={(e) => setLastRenewalDisplay(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>
          )}

          {/* Next Renewal Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Ngày cần gia hạn tiếp theo (DD/MM/YYYY)
            </label>
            <input
              type="text"
              required
              placeholder="DD/MM/YYYY (VD: 28/11/2026)"
              value={renewalDisplay}
              onChange={(e) => setRenewalDisplay(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" /> Ghi chú
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {editingSubscription ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
