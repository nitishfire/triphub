import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function ToastItem({ t }) {
  const [progress, setProgress] = useState(100);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const duration = (t.duration == null ? 3000 : t.duration);

  useEffect(() => {
    if (!t.visible || t.type === 'loading') return;
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [t.visible, t.id, duration]);

  const cfg = {
    success: {
      wrap: 'bg-white border-emerald-200',
      iconWrap: 'bg-emerald-100 text-emerald-600',
      bar: 'bg-emerald-500',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
    },
    error: {
      wrap: 'bg-white border-red-200',
      iconWrap: 'bg-red-100 text-red-500',
      bar: 'bg-red-500',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    loading: {
      wrap: 'bg-white border-indigo-200',
      iconWrap: 'bg-indigo-100 text-indigo-600',
      bar: 'bg-indigo-500',
      icon: <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin block" />
    }
  };

  const s = cfg[t.type] || cfg.loading;

  return (
    <div
      style={{ pointerEvents: 'auto' }}
      className={`${s.wrap} border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden w-[340px] transition-all duration-300 ${t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95'}`}
    >
      <div className="flex items-start gap-3 px-4 pt-4 pb-3.5">
        <div className={`w-8 h-8 rounded-xl ${s.iconWrap} flex items-center justify-center shrink-0 mt-0.5`}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm font-semibold leading-snug">
            {typeof t.message === 'string' ? t.message : t.message}
          </p>
        </div>
        {t.type !== 'loading' && (
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 -mt-0.5 -mr-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {t.type !== 'loading' && (
        <div className="h-[3px] bg-gray-100">
          <div
            className={`h-full ${s.bar} rounded-full`}
            style={{ width: progress + '%', transition: 'width 60ms linear' }}
          />
        </div>
      )}
    </div>
  );
}

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 80, right: 16 }}
      toastOptions={{ duration: 3000 }}
    >
      {(t) => <ToastItem t={t} />}
    </Toaster>
  );
}
