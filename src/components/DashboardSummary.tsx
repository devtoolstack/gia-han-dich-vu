import React from 'react';
import { Subscription } from '../types';
import { getMonthlyCostInVND, getYearlyCostInVND, getDaysLeft, formatVND } from '../utils/helpers';
import { Layers, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

interface DashboardSummaryProps {
  subscriptions: Subscription[];
  exchangeRate: number;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ subscriptions, exchangeRate }) => {
  const totalCount = subscriptions.length;

  const totalMonthlyVND = subscriptions.reduce((sum, sub) => sum + getMonthlyCostInVND(sub, exchangeRate), 0);
  const totalYearlyVND = subscriptions.reduce((sum, sub) => sum + getYearlyCostInVND(sub, exchangeRate), 0);

  const urgentCount = subscriptions.filter(sub => {
    const days = getDaysLeft(sub.renewalDate);
    return days <= 7;
  }).length;

  const overdueCount = subscriptions.filter(sub => {
    const days = getDaysLeft(sub.renewalDate);
    return days < 0;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Services */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng dịch vụ</span>
          <Layers className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-semibold text-slate-900">{totalCount}</div>
        <div className="mt-2 text-xs text-slate-500">Đang theo dõi định kỳ</div>
      </div>

      {/* Monthly Cost Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chi phí / tháng</span>
          <DollarSign className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-slate-900 truncate" title={formatVND(totalMonthlyVND)}>
          {formatVND(totalMonthlyVND)}
        </div>
        <div className="mt-2 text-xs text-slate-500">Quy đổi ra VNĐ</div>
      </div>

      {/* Yearly Cost Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chi phí / năm</span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-slate-900 truncate" title={formatVND(totalYearlyVND)}>
          {formatVND(totalYearlyVND)}
        </div>
        <div className="mt-2 text-xs text-slate-500">Dự kiến trong 12 tháng</div>
      </div>

      {/* Urgent Renewals Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cần gia hạn</span>
          <AlertTriangle className={`w-4 h-4 ${urgentCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-semibold ${urgentCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {urgentCount}
          </span>
          <span className="text-xs text-slate-400">trong 7 ngày tới</span>
        </div>
        <div className="mt-2 text-xs">
          {overdueCount > 0 ? (
            <span className="text-rose-600 font-medium">{overdueCount} dịch vụ đã quá hạn!</span>
          ) : (
            <span className="text-slate-500">Không có dịch vụ quá hạn</span>
          )}
        </div>
      </div>
    </div>
  );
};
