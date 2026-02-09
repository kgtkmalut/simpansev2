
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';

interface SuperAdminDashboardProps {
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  setNotification: (notif: {message: string, type: 'email' | 'success'} | null) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ users, onUpdateUsers, setNotification }) => {
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  const getRoleFacilities = (role: UserRole): string => {
    switch (role) {
      case 'SuperAdmin':
        return 'Kontrol Penuh Pengguna, Pengaturan Branding & Slider, Manajemen Katalog, dan Verifikasi Otoritas.';
      case 'Admin':
        return 'Manajemen Inventaris (Master Barang), Monitoring Log Transaksi, dan Ekspor Laporan CSV.';
      case 'Verificator':
        return 'Persetujuan Akhir Peminjaman, Peninjauan Ulang Data (Review Required), dan Otoritas Penolakan.';
      default:
        return 'Akses Katalog Aset dan Status Peminjaman Pribadi.';
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    let updatedUsers: UserAccount[];
    if (isAdding) {
      updatedUsers = [...users, { ...editingUser, id: Math.random().toString(36).substr(2, 9) }];
      
      // Mengirimkan notifikasi email detail
      const facilities = getRoleFacilities(editingUser.role);
      const emailContent = `
        Username: ${editingUser.username}
        Password: ${editingUser.password}
        Status Peran: ${editingUser.role}
        Fasilitas: ${facilities}
      `;
      
      setNotification({ 
        message: `Email Notifikasi Terkirim ke ${editingUser.email}! ${emailContent}`, 
        type: 'email' 
      });
      
      console.log(`[SIMULASI EMAIL TERKIRIM KE ${editingUser.email}]`, emailContent);
    } else {
      updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
      setNotification({ message: 'Profil pengguna berhasil diperbarui.', type: 'success' });
    }

    onUpdateUsers(updatedUsers);
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'SuperAdmin' && users.filter(u => u.role === 'SuperAdmin').length <= 1) {
      alert('Gagal! Harus ada setidaknya satu SuperAdmin di dalam sistem.');
      return;
    }
    if (confirm('Hapus akses pengguna ini secara permanen?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
      setNotification({ message: 'Pengguna dihapus.', type: 'success' });
    }
  };

  const syncToCloud = () => {
    const headers = ['ID', 'Nama', 'Username', 'Email', 'Role'];
    const rows = users.map(u => [u.id, u.name, u.username, u.email, u.role]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Simpanse_user_sync_${new Date().getTime()}.csv`);
    link.click();
    
    setNotification({ 
      message: 'Data pengguna disinkronkan ke folder "Simpanse user" (Cloud Storage).', 
      type: 'success' 
    });
  };

  return (
    <div className="space-y-8 animate-slide-down">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Otoritas Pengguna Sistem</h2>
          <p className="text-slate-500 text-sm font-medium">Kelola hak akses admin, verifikator, dan operator.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={syncToCloud}
            className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            Sync GDrive
          </button>
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingUser({ id: '', name: '', username: '', email: '', role: 'Admin', password: 'user' + Math.floor(Math.random() * 999) });
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-95"
          >
            + Daftarkan User Baru
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="mb-8 relative max-w-md">
          <input 
            type="text" 
            placeholder="Cari nama atau email user..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 transition-all hover:shadow-lg hover:shadow-purple-900/5 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                  user.role === 'SuperAdmin' ? 'bg-purple-600 text-white' : 
                  user.role === 'Verificator' ? 'bg-yellow-400 text-blue-900' : 'bg-blue-600 text-white'
                }`}>
                  {user.name[0]}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-lg border border-slate-100">{user.role}</span>
              </div>
              
              <h3 className="font-black text-slate-800 group-hover:text-purple-600 transition-colors">{user.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 mb-4 truncate">@{user.username} • {user.email}</p>
              
              <div className="flex space-x-2 pt-2">
                <button 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingUser(user);
                  }}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all"
                >
                  Edit Info / Peran
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-down border-4 border-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{isAdding ? 'Registrasi Akun Baru' : 'Mutasi Hak Akses'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Konfigurasi Autentikasi Pengguna</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-10 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Staf</label>
                <input required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value.toLowerCase()})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peran Akses (Role)</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black appearance-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}>
                  <option value="Admin">Administrator (Master Barang & Log)</option>
                  <option value="Verificator">Verifikator (Persetujuan Akhir)</option>
                  <option value="SuperAdmin">Super Admin (Kontrol Penuh)</option>
                </select>
                <p className="text-[9px] text-slate-400 font-medium mt-1 italic leading-tight">
                  Fasilitas: {getRoleFacilities(editingUser.role)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Sistem</label>
                <input required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-blue-600" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
              </div>

              <div className="pt-6 flex space-x-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl">Batal</button>
                <button type="submit" className="flex-[2] py-4 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all">
                  {isAdding ? 'Daftarkan & Kirim Email' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
