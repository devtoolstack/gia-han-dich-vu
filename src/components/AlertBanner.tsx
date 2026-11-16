import React from 'react';
import { Subscription } from '../types';
import { getDaysLeft, formatVND, getCostInVND, formatDateVN } from '../utils/helpers';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AlertBannerProps {
  subscriptions: Subscription[];
  exchangeRate: number;
  onSelectSub: (sub: Subscription) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ subscriptions, exchangeRate, onSelectSub }) => {
  const urgentSubs = subscriptions.filter(sub => {
    const days = getDaysLeft(sub.renewalDate);
    return days <= 3;
  }).sort((a, b) => getDaysLeft(a.renewalDate) - getDaysLeft(b.renewalDate));

  if (urgentSubs.length === 0) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-slate-800">
      <div className="flex items-center space-x-2.5 mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <h2 className="text-sm font-semibold text-slate-900">
          Có {urgentSubs.length} dịch vụ sắp đến hạn hoặc đã quá hạn cần chú ý:
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {urgentSubs.map(sub => {
          const days = getDaysLeft(sub.renewalDate);
          const isOverdue = days < 0;
          const vndCost = getCostInVND(sub.price, sub.currency, exchangeRate);
          return (
            <div
              key={sub.id}
              className="bg-white rounded-lg p-3 border border-amber-200 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isOverdue ? `Quá hạn ${Math.abs(days)} ngày` : days === 0 ? 'Hết hạn hôm nay' : `Còn ${days} ngày`}
                  </span>
                </div>
                <h4
                  onClick={() => onSelectSub(sub)}
                  className="font-semibold text-slate-900 text-sm cursor-pointer hover:underline truncate mt-1"
                  title={sub.name}
                >
                  {sub.name}
                </h4>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>Hạn: {formatDateVN(sub.renewalDate)}</span>
                  <span className="font-semibold text-slate-900">
                    {formatVND(vndCost)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => onSelectSub(sub)}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-medium"
                >
                  <span>Chỉnh sửa / Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
