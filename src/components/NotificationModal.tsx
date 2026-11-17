import React, { useState, useEffect } from 'react';
import { X, Bell, Mail, MessageCircle, CheckCircle2, Clock, Cpu } from 'lucide-react';

interface NotificationSettings {
  email: string;
  zaloPhone: string;
  notify7Days: boolean;
  notify3Days: boolean;
  notify1Day: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('subtracker_notif_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      email: '',
      zaloPhone: '',
      notify7Days: true,
      notify3Days: true,
      notify1Day: true,
    };
  });

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('subtracker_notif_settings_v1', JSON.stringify(settings));
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Đã lưu cấu hình thông báo tự động thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Hệ thống thông báo tự động (Cron Job)</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Explanation Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Chạy tự động ngầm 100% (Không cần mở app)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống tích hợp <strong>Vercel Cron Job</strong> (`/api/cron-notify.ts`) sẽ tự động quét các dịch vụ sắp đến hạn vào lúc <strong>8:00 sáng mỗi ngày</strong> và tự động gửi thông báo qua Email & Zalo mà bạn không cần phải đăng nhập hay bấm thủ công.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Email nhận thông báo tự động
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Số điện thoại / Zalo OA
                </label>
                <input
                  type="text"
                  placeholder="0912345678"
                  value={settings.zaloPhone}
                  onChange={(e) => setSettings({ ...settings, zaloPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Thresholds */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Mốc thời gian tự động gửi nhắc nhở
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify7Days}
                    onChange={(e) => setSettings({ ...settings, notify7Days: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                  />
                  <span>Trước 7 ngày</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify3Days}
                    onChange={(e) => setSettings({ ...settings, notify3Days: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                  />
                  <span>Trước 3 ngày</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notify1Day}
                    onChange={(e) => setSettings({ ...settings, notify1Day: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                  />
                  <span>Trước 1 ngày (Khẩn cấp)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Lưu cấu hình nhận tin tự động
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
