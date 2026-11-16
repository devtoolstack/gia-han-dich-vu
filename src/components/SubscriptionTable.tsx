import React from 'react';
import { Subscription } from '../types';
import { getDaysLeft, formatVND, getCostInVND, formatDateVN } from '../utils/helpers';
import { Edit3, Trash2 } from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  exchangeRate: number;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  exchangeRate,
  onEdit,
  onDelete,
}) => {
  const getBillingCycleLabel = (cycle: string, customMonths?: number) => {
    switch (cycle) {
      case 'monthly': return 'Hàng tháng';
      case 'quarterly': return 'Hàng quý (3 tháng)';
      case 'yearly': return 'Hàng năm';
      case 'custom': return `${customMonths || 1} tháng`;
      default: return cycle;
    }
  };

  const getDaysLeftBadge = (renewalDate: string) => {
    const days = getDaysLeft(renewalDate);
    if (days < 0) {
      return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Quá hạn {Math.abs(days)} ngày</span>;
    } else if (days === 0) {
      return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Hôm nay</span>;
    } else if (days <= 3) {
      return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">Còn {days} ngày</span>;
    } else if (days <= 7) {
      return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Còn {days} ngày</span>;
    } else {
      return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Còn {days} ngày</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Tên dịch vụ</th>
              <th className="py-3 px-4">Chi phí (Quy đổi VNĐ)</th>
              <th className="py-3 px-4">Chu kỳ</th>
              <th className="py-3 px-4">Gần nhất</th>
              <th className="py-3 px-4">Cần gia hạn</th>
              <th className="py-3 px-4">Số ngày còn lại</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {subscriptions.map((sub) => {
              const vndAmount = getCostInVND(sub.price, sub.currency, exchangeRate);
              return (
                <tr key={sub.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{sub.name}</div>
                    {sub.notes && <div className="text-xs text-slate-400 truncate max-w-xs">{sub.notes}</div>}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{formatVND(vndAmount)}</div>
                    {sub.currency === 'USD' && (
                      <div className="text-[11px] font-normal text-slate-400">(${sub.price} USD)</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 font-medium">
                    {getBillingCycleLabel(sub.billingCycle, sub.customMonths)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    {formatDateVN(sub.lastRenewalDate)}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {formatDateVN(sub.renewalDate)}
                  </td>
                  <td className="py-3 px-4">
                    {getDaysLeftBadge(sub.renewalDate)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(sub)}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors inline-flex"
                      title="Sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors inline-flex"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
