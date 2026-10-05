import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-3">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        let borderClass = 'border-emerald-200 bg-white text-[#263238] shadow-sm border-l-4 border-l-emerald-600';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
          borderClass = 'border-rose-200 bg-white text-[#263238] shadow-sm border-l-4 border-l-rose-600';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 bg-white text-[#263238] shadow-sm border-l-4 border-l-amber-500';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-[#159A9C] shrink-0" />;
          borderClass = 'border-[#159A9C]/30 bg-white text-[#263238] shadow-sm border-l-4 border-l-[#159A9C]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg border transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${borderClass}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-[#173B57] leading-tight">{toast.title}</h5>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
