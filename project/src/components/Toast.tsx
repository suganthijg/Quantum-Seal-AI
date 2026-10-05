import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  notify: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('ToastProvider missing');
  return c;
}

const config: Record<ToastType, { icon: typeof Info; ring: string; text: string }> = {
  success: { icon: CheckCircle2, ring: 'ring-emerald-400/40', text: 'text-emerald-500' },
  error: { icon: XCircle, ring: 'ring-rose-400/40', text: 'text-rose-500' },
  warning: { icon: AlertTriangle, ring: 'ring-amber-400/40', text: 'text-amber-500' },
  info: { icon: Info, ring: 'ring-cyber-400/40', text: 'text-cyber-500' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, ring, text } = config[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`glass-strong rounded-xl px-4 py-3 shadow-xl ring-1 ${ring} pointer-events-auto flex items-start gap-3 max-w-sm`}
              >
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${text}`} />
                <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{t.message}</p>
                <button
                  onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
