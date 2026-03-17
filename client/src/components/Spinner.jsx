export default function Spinner({ size, className }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-14 h-14' : 'w-8 h-8';
  const borderWidth = size === 'sm' ? 'border-2' : 'border-[3px]';
  return (
    <div className={'flex items-center justify-center ' + (className || '')}>
      <div className={sizeClass + ' ' + borderWidth + ' border-indigo-100 border-t-indigo-600 rounded-full animate-spin'} style={{ background: 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.1))' }} />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            <img src="/logo.png" alt="TripHub" className="w-full h-full object-contain animate-pulse" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl items-center justify-center shadow-xl shadow-indigo-500/30 hidden animate-pulse">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>
          <div className="absolute -inset-3">
            <div className="w-[88px] h-[88px] mx-auto border-[3px] border-transparent border-t-indigo-500 rounded-full animate-spin" />
          </div>
        </div>
        <p className="text-gray-400 text-sm font-medium tracking-wide">Loading...</p>
      </div>
    </div>
  );
}
