import React from 'react';
import { CreditCard, Plus, Download, Upload, RefreshCw, Settings, ShieldCheck, Bell } from 'lucide-react';

interface NavbarProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  onNotificationClick: () => void;
  onResetData: () => void;
  exchangeRate: number;
  onUpdateExchangeRate: (rate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddClick,
  onExportClick,
  onImportClick,
  onNotificationClick,
  onResetData,
  exchangeRate,
  onUpdateExchangeRate,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [tempRate, setTempRate] = React.useState(exchangeRate.toString());

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(tempRate);
    if (!isNaN(num) && num > 0) {
      onUpdateExchangeRate(num);
      setShowSettings(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SubTracker</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-slate-600" /> Quản lý gia hạn
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Theo dõi đăng ký dịch vụ & thông báo tự động</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNotificationClick}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Cài đặt thông báo Email & Zalo"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Cài đặt tỷ giá & dữ liệu"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={onExportClick}
            className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Xuất file JSON sao lưu"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Sao lưu</span>
          </button>

          <button
            onClick={onImportClick}
            className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Khôi phục từ file JSON"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Khôi phục</span>
          </button>

          <button
            onClick={onAddClick}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm dịch vụ</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute right-4 sm:right-28 top-16 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-slate-700" /> Tùy chỉnh hệ thống
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Đóng
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tỷ giá USD sang VNĐ (Quy đổi thống kê):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={tempRate}
                  onChange={(e) => setTempRate(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  step="100"
                  min="1000"
                />
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">đ / $1</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Lưu tỷ giá
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <div className="flex md:hidden space-x-2">
              <button
                onClick={() => { setShowSettings(false); onExportClick(); }}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" /> <span>Sao lưu</span>
              </button>
              <button
                onClick={() => { setShowSettings(false); onImportClick(); }}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                <Upload className="w-3.5 h-3.5" /> <span>Khôi phục</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu mẫu ban đầu? Mọi thay đổi hiện tại sẽ bị ghi đè.')) {
                  onResetData();
                  setShowSettings(false);
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu mẫu ban đầu</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
