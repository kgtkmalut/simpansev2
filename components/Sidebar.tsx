
import React from 'react';
import { ViewType, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  userRole: UserRole;
  appName: string;
  logoUrl: string;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole, appName, logoUrl, onLogout, onLoginClick }) => {
  const getNavItems = () => {
    const common = [
      { id: 'catalog', label: 'Katalog Aset', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { id: 'my-loans', label: 'Peminjaman Saya', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    ];

    if (userRole === 'Admin') return [
      ...common,
      { id: 'admin-items', label: 'Master Barang', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { id: 'admin-tracking', label: 'Log Transaksi', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2' }
    ];

    if (userRole === 'Verificator') return [
      ...common,
      { id: 'verificator-approval', label: 'Verifikasi', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    if (userRole === 'SuperAdmin') return [
      ...common,
      { id: 'super-admin-users', label: 'User Control', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { id: 'super-admin-settings', label: 'Branding & Slider', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
    ];

    return common;
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
        <img src={logoUrl} alt="App Logo" className="w-32 h-32 object-contain mb-4" />
        <h1 className="text-xl font-black text-blue-600 tracking-tight leading-none">{appName}</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Peminjaman Aset</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {getNavItems().map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              currentView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-2xl mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Status Peran</p>
          <p className="text-sm font-bold text-slate-800">{userRole}</p>
        </div>
        {userRole === 'Borrower' ? (
          <button onClick={onLoginClick} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">Login Staf</button>
        ) : (
          <button onClick={onLogout} className="w-full py-2.5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all">Keluar Sistem</button>
        )}
      </div>
    </div>
  );
};
