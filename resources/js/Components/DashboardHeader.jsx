import { GraduationCap } from 'lucide-react';

export default function DashboardHeader({ currentItem }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-800 z-10 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden shadow-md">
          <GraduationCap className="text-[#1e3a8a] w-6 h-6" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#2b82c9]">FST Settat</span>
      </div>
      <h1 className="text-xl font-bold tracking-wide text-slate-100">Let'Study Dashboard</h1>
      
    </header>
  );
}
