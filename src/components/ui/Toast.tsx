import { useAppStore } from '../../stores/appStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Toast() {
  const { toast, clearToast } = useAppStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-[slideUp_0.3s_ease]">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px]',
          {
            'bg-emerald-50 border-emerald-200 text-emerald-800': toast.type === 'success',
            'bg-red-50 border-red-200 text-red-800': toast.type === 'error',
            'bg-blue-50 border-blue-200 text-blue-800': toast.type === 'info',
          }
        )}
      >
        {toast.type === 'success' && <CheckCircle size={18} />}
        {toast.type === 'error' && <XCircle size={18} />}
        {toast.type === 'info' && <Info size={18} />}
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={clearToast} className="p-0.5 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
