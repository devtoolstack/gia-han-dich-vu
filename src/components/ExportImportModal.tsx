import React, { useState } from 'react';
import { Subscription } from '../types';
import { X, Download, Upload, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onImportData: (imported: Subscription[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onImportData,
}) => {
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subscriptions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `subtracker_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMsg('Đã xuất file sao lưu JSON thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('Dữ liệu JSON không hợp lệ (phải là một danh sách các dịch vụ).');
      }
      // Validate basic structure
      for (const item of parsed) {
        if (!item.name || !item.renewalDate) {
          throw new Error('Mỗi dịch vụ cần có ít nhất tên (name) và ngày gia hạn (renewalDate).');
        }
      }
      onImportData(parsed);
      setSuccessMsg(`Khôi phục thành công ${parsed.length} dịch vụ!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setImportText('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi phân tích cú pháp JSON.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          setImportText(content);
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
            setSuccessMsg(`Đã nhập thành công ${parsed.length} dịch vụ từ file!`);
            setTimeout(() => {
              onClose();
              setSuccessMsg('');
              setImportText('');
            }, 1500);
          } else {
            setErrorMsg('File JSON không đúng định dạng danh sách dịch vụ.');
          }
        } catch (err) {
          setErrorMsg('Không thể đọc file JSON.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <FileCode className="w-5 h-5 mr-2 text-indigo-600" /> Sao lưu & Khôi phục Dữ liệu
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => { setActiveTab('export'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sao lưu (Export JSON)
          </button>
          <button
            onClick={() => { setActiveTab('import'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Khôi phục (Import JSON)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Xuất toàn bộ danh sách {subscriptions.length} dịch vụ hiện tại ra file JSON để lưu trữ hoặc chuyển sang thiết bị khác.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(subscriptions, null, 2)}</pre>
              </div>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium shadow-md shadow-indigo-200 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống file sao lưu (.json)</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <p className="text-sm text-slate-600">
                Tải lên file JSON hoặc dán mã JSON vào ô bên dưới để khôi phục dữ liệu. (Lưu ý: Dữ liệu nhập sẽ thay thế danh sách hiện tại).
              </p>
              <div>
                <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase">Tải file từ máy</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700 uppercase">Hoặc dán nội dung JSON</label>
                <textarea
                  rows={6}
                  placeholder="[ { ... } ]"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium shadow-md shadow-indigo-200 transition-transform active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Xác nhận khôi phục</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
