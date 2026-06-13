export default function ApiLogsPanel({ logs, title, emptyMessage }) {
  const getLogColor = (log) => {
    if (log.includes('DELETE')) return 'text-rose-400';
    if (log.includes('POST')) return 'text-sky-400';
    if (log.includes('PUT')) return 'text-amber-400';
    if (log.includes('GET')) return 'text-emerald-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-5 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase">{title}</div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-xs text-slate-400">
        {logs.length === 0 ? (
          <p className="text-slate-600">{emptyMessage}</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-500">&gt;&gt;</span>
              <p className={getLogColor(log)}>{log}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
