import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function DashboardSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  adminProfile,
  setIsProfileOpen,
  setActiveProfileTab,
  menuItems,
  activeTab,
  setActiveTab
}) {
  return (
    <aside
      className={`fixed top-0 right-0 h-full w-64 bg-[#141f32] border-l border-slate-800 flex flex-col transition-transform duration-300 z-50 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-[#1e293b] text-white rounded-full flex items-center justify-center border border-slate-700 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.6)] z-50 hover:bg-slate-700 transition-colors"
        title={isSidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}
      >
        {isSidebarOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div
        onClick={() => {
          setIsProfileOpen(true);
          setActiveProfileTab('info');
        }}
        className="p-4 m-2 rounded-xl border border-transparent hover:border-slate-700/60 hover:bg-slate-800/40 cursor-pointer transition-all duration-200 flex flex-col gap-3 group"
        title="Gérer mon profil"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-inner text-white font-extrabold text-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: adminProfile.avatarColor }}
        >
          {adminProfile.nom[0]}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#2b82c9] transition-colors truncate">
            {adminProfile.nom}
          </h3>
          <p className="text-xs text-slate-400 font-mono truncate">@{adminProfile.username}</p>
          <p className="text-[10px] text-slate-500 truncate">{adminProfile.role ? adminProfile.role.toUpperCase() : 'Étudiant/Admin'}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.key
                ? 'bg-[#2b82c9] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
