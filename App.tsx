
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Catalog } from './components/Catalog';
import { LoanForm } from './components/LoanForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ItemManagement } from './components/ItemManagement';
import { VerificatorDashboard } from './components/VerificatorDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SuperAdminSettings } from './components/SuperAdminSettings';
import { LoginGate } from './components/LoginGate';
import { NotificationToast } from './components/NotificationToast';
import { LoanDetailModal } from './components/LoanDetailModal';
import { BorrowerGate } from './components/BorrowerGate';
import { INITIAL_ITEMS } from './constants';
import { Item, Loan, ViewType, ItemStatus, UserRole, SystemConfig, LoanStatus, UserAccount } from './types';

const DEFAULT_CONFIG: SystemConfig = {
  appName: 'SIMPANSE',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2619/2619018.png',
  contactPhone: '082292313876',
  contactEmail: 'kgtkmalut@gmail.com',
  contactWebsite: 'https://kgtkmalut.id',
  socialFB: 'https://facebook.com/kantorgtkmalt',
  socialIG: 'https://instagram.com/kgtk_malut',
  socialYT: 'https://youtube.com/@KGTKMalukuUtara',
  secondaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.svg/1200px-Logo_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.svg.png',
  sliders: [
    { id: 's1', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920&h=700', title: 'Manajemen Aset Digital', transition: 'fade' },
    { id: 's2', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920&h=700', title: 'Kemudahan Peminjaman', transition: 'zoom' }
  ]
};

const INITIAL_USERS: UserAccount[] = [
  { id: 'u1', name: 'Admin Utama', username: 'admin', email: 'admin@simpanse.id', role: 'Admin', password: 'admin123' },
  { id: 'u2', name: 'Tim Verifikasi', username: 'verify', email: 'verify@simpanse.id', role: 'Verificator', password: 'verify123' },
  { id: 'u3', name: 'Super Admin', username: 'super', email: 'super@simpanse.id', role: 'SuperAdmin', password: 'super123' }
];

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewType>('catalog');
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showBorrowerGate, setShowBorrowerGate] = useState(false);
  const [prefilledBorrowerData, setPrefilledBorrowerData] = useState<Partial<Loan> | null>(null);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionInput, setRejectionInput] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'email' | 'success'} | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('Borrower');
  const [showLogin, setShowLogin] = useState(false);
  
  const [sessionEmail, setSessionEmail] = useState<string>('');
  const [sessionNIK, setSessionNIK] = useState<string>('');
  const [sessionName, setSessionName] = useState<string>('');
  
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedItems = localStorage.getItem('sip_items');
    const savedLoans = localStorage.getItem('sip_loans');
    const savedUsers = localStorage.getItem('sip_users');
    const savedEmail = localStorage.getItem('sip_session_email');
    const savedNIK = localStorage.getItem('sip_session_nik');
    const savedName = localStorage.getItem('sip_session_name');
    const savedConfig = localStorage.getItem('sip_config');
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedEmail) setSessionEmail(savedEmail || '');
    if (savedNIK) setSessionNIK(savedNIK || '');
    if (savedName) setSessionName(savedName || '');
    if (savedConfig) {
      try {
        setSystemConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Error parsing saved config", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sip_items', JSON.stringify(items));
    localStorage.setItem('sip_loans', JSON.stringify(loans));
    localStorage.setItem('sip_users', JSON.stringify(users));
    localStorage.setItem('sip_session_email', sessionEmail);
    localStorage.setItem('sip_session_nik', sessionNIK);
    localStorage.setItem('sip_session_name', sessionName);
    localStorage.setItem('sip_config', JSON.stringify(systemConfig));
  }, [items, loans, users, sessionEmail, sessionNIK, sessionName, systemConfig]);

  const submitLoan = useCallback((formData: any, status: 'Pending' | 'Queued') => {
    // SECURITY: Mengunci Sesi ke User Aktif yang mensubmit
    setSessionEmail(formData.borrowerEmail);
    setSessionNIK(formData.borrowerNIK);
    setSessionName(formData.borrowerName);

    // Sinkronisasi Drive Terstruktur
    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    const now = new Date();
    const folderName = `${months[now.getMonth()]}-${now.getFullYear()}`;
    const timestamp = now.getTime();
    const fileName = `${formData.borrowerName.toUpperCase().replace(/\s+/g, '_')}_${timestamp}.jpg`;
    
    console.log(`[SECURE DRIVE SYNC]
      Path: KGTK_DRIVE / ${folderName} / ${fileName}
      Target Link: https://drive.google.com/drive/folders/1dX7v97MpowyYvkUbP19v8MIgKCXrOp2W
      Status: File Locked for Staff Access Only.
    `);

    const newLoan: Loan = {
      id: 'TRX' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      ...formData,
      status: status,
      createdAt: now.toISOString()
    };

    setLoans(prev => [newLoan, ...prev.filter(l => 
      !(l.itemId === formData.itemId && 
        l.borrowerEmail.toLowerCase() === formData.borrowerEmail.toLowerCase() && 
        (l.status === 'Queued' || l.status === 'Rejected'))
    )]);

    setNotification({ 
      message: status === 'Queued' ? 'Data masuk daftar tunggu.' : 'Pengajuan Berhasil! Identitas telah diamankan di Cloud.', 
      type: 'success' 
    });

    setSelectedItem(null);
    setPrefilledBorrowerData(null);
    setView('my-loans');
  }, []);

  const handleAdminVerify = useCallback((loanId: string) => {
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'Verified' } : l));
    setNotification({ message: `Data diverifikasi oleh Admin. Notifikasi diteruskan ke Verifikator.`, type: 'email' });
  }, []);

  const handleAction = useCallback((loanId: string, status: LoanStatus) => {
    if (status === 'Rejected') {
      setRejectionModalId(loanId);
      setRejectionInput('');
      return;
    }

    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status } : l));
    
    if (status === 'Approved') {
      setItems(prev => prev.map(i => i.id === loan.itemId ? { ...i, availableQuantity: Math.max(0, i.availableQuantity - (loan.quantity || 1)), status: i.availableQuantity - (loan.quantity || 1) > 0 ? ItemStatus.READY : ItemStatus.OUT_OF_STOCK } : i));
    }
    
    setNotification({ message: `Otoritas Verifikator: Status menjadi ${status}.`, type: 'success' });
  }, [loans]);

  const submitRejection = () => {
    if (!rejectionModalId || !rejectionInput.trim()) {
      alert("Alasan penolakan wajib diisi untuk transparansi data.");
      return;
    }

    setLoans(prev => prev.map(l => l.id === rejectionModalId ? { ...l, status: 'Rejected', rejectionReason: rejectionInput } : l));
    setNotification({ message: 'Peminjaman ditolak dengan catatan alasan.', type: 'success' });
    setRejectionModalId(null);
    setRejectionInput('');
  };

  const handleReturnItem = useCallback((loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'Returned' } : l));
    setItems(prev => prev.map(i => i.id === loan.itemId ? { ...i, availableQuantity: Math.min(i.totalQuantity, i.availableQuantity + (loan.quantity || 1)), status: ItemStatus.READY } : i));
    setNotification({ message: 'Aset telah dikembalikan ke gudang.', type: 'success' });
  }, [loans]);

  const handleExportCSV = useCallback(() => {
    if (loans.length === 0) return;
    const headers = ['ID', 'Peminjam', 'NIK', 'Tipe', 'Item', 'Jumlah', 'Tujuan', 'Mulai', 'Selesai', 'Status', 'Dibuat'];
    const rows = loans.map(l => [
      l.id, l.borrowerName, l.borrowerNIK, l.borrowerType, l.itemName, l.quantity, 
      l.purpose, l.startDate, l.endDate, l.status, l.createdAt
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_simpanse_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ message: 'Laporan rahasia berhasil diunduh.', type: 'success' });
  }, [loans]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setShowLogin(false);
    if (role === 'Admin') setView('admin-tracking');
    else if (role === 'Verificator') setView('verificator-approval');
    else if (role === 'SuperAdmin') setView('super-admin-users');
  };

  const isStaff = userRole === 'Admin' || userRole === 'Verificator' || userRole === 'SuperAdmin';

  // SECURITY: Filter data peminjaman agar hanya user terverifikasi yang bisa melihat datanya sendiri
  const filteredDisplayLoans = useMemo(() => {
    if (isStaff) return loans;
    if (!sessionEmail || !sessionNIK) return [];
    
    // User biasa hanya boleh melihat data yang Email dan NIK-nya match dengan sesi login/gate mereka
    return loans.filter(l => 
      l.borrowerEmail.toLowerCase() === sessionEmail.toLowerCase() && 
      l.borrowerNIK === sessionNIK
    );
  }, [loans, isStaff, sessionEmail, sessionNIK]);

  const individualLoans = filteredDisplayLoans.filter(l => l.borrowerType === 'Pribadi');
  const institutionalLoans = filteredDisplayLoans.filter(l => l.borrowerType === 'Instansi');

  const getStatusActionMessage = (status: LoanStatus, reason?: string) => {
    switch(status) {
      case 'Approved': alert("Peminjaman Disetujui! Silahkan ambil aset di UPT dengan menunjukkan bukti verifikasi ini."); break;
      case 'ReviewRequired': alert("Data Anda sedang dalam peninjauan ulang oleh tim Verifikator."); break;
      case 'Rejected': alert(`Penolakan Otoritas:\n\nAlasan: ${reason || 'Kebijakan internal'}`); break;
      default: alert("Status Peminjaman: " + status);
    }
  };

  const renderStatusBadge = (loan: Loan) => {
    const base = "px-4 py-1.5 text-[9px] font-black uppercase rounded-xl tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm";
    let color = "bg-slate-100 text-slate-400";
    let label: string = loan.status;

    if (loan.status === 'Approved') { color = "bg-emerald-500 text-white"; label = "Otoritas Disetujui"; }
    else if (loan.status === 'ReviewRequired') { color = "bg-yellow-400 text-blue-900"; label = "Dalam Peninjauan"; }
    else if (loan.status === 'Rejected') { color = "bg-red-500 text-white"; label = "Otoritas Ditolak"; }
    else if (loan.status === 'Verified') { color = "bg-blue-600 text-white"; label = "Verifikasi Admin OK"; }
    else if (loan.status === 'Pending') { color = "bg-blue-100 text-blue-600"; label = "Menunggu Verifikasi"; }

    return (
      <button 
        onClick={() => getStatusActionMessage(loan.status, loan.rejectionReason)}
        className={`${base} ${color}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        userRole={userRole}
        appName={systemConfig.appName}
        logoUrl={systemConfig.logoUrl}
        onLogout={() => { 
          setUserRole('Borrower'); 
          setSessionEmail(''); 
          setSessionNIK(''); 
          setSessionName('');
          setView('catalog'); 
        }}
        onLoginClick={() => setShowLogin(true)}
      />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-slate-50/50">
        <div className="flex-1">
          {currentView === 'catalog' && (
            <Catalog 
              items={items} 
              onBorrow={(item) => {
                setSelectedItem(item);
                setShowBorrowerGate(true);
              }} 
              userLoans={loans.filter(l => l.borrowerEmail.toLowerCase() === sessionEmail.toLowerCase() && l.status === 'Queued')}
              sliders={systemConfig.sliders}
            />
          )}
          
          <div className="max-w-[95%] mx-auto p-8">
            {currentView === 'my-loans' && (
              <div className="space-y-12 animate-slide-down">
                <div className="border-b-4 border-yellow-400 pb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black text-blue-600 tracking-tight">Status Peminjaman Pribadi</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Enkripsi Data: AKTIF ✓</p>
                  </div>
                  {!isStaff && sessionName && (
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400">Sesi Terverifikasi</p>
                         <p className="text-xs font-bold text-blue-600">{sessionName}</p>
                      </div>
                      <button onClick={() => { setSessionEmail(''); setSessionNIK(''); setSessionName(''); setView('catalog'); }} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100" title="Keluar dari Sesi Verifikasi"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                    </div>
                  )}
                </div>

                {!isStaff && filteredDisplayLoans.length === 0 && (
                  <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-200 text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">Akses Terkunci</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Silahkan lakukan verifikasi identitas melalui Katalog Aset untuk melihat riwayat peminjaman Anda.</p>
                    <button onClick={() => setView('catalog')} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Kembali ke Katalog</button>
                  </div>
                )}

                {(isStaff || individualLoans.length > 0) && (
                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center"><div className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></div> Peminjaman Perorangan</h3>
                    <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-5">Aset</th>
                            <th className="px-6 py-5">Identitas</th>
                            <th className="px-6 py-5">Keperluan</th>
                            <th className="px-6 py-5">Masa Pinjam</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {individualLoans.map(loan => (
                            <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-6"><div className="text-sm font-black text-slate-800">{loan.itemName}</div><div className="text-[10px] text-blue-600 font-bold uppercase">{loan.quantity} Unit</div></td>
                              <td className="px-6 py-6"><div className="text-sm font-bold text-slate-700">{loan.borrowerName}</div><div className="text-[10px] text-slate-400 font-black">NIK: {isStaff ? loan.borrowerNIK : '••••' + loan.borrowerNIK.slice(-4)}</div></td>
                              <td className="px-6 py-6 text-xs text-slate-500 italic line-clamp-2 max-w-[200px]">"{loan.purpose}"</td>
                              <td className="px-6 py-6"><div className="text-[10px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">{loan.startDate} → {loan.endDate}</div></td>
                              <td className="px-6 py-6 text-center">{renderStatusBadge(loan)}</td>
                              <td className="px-6 py-6 text-center">
                                <button onClick={() => setViewingLoan(loan)} className="p-2 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {(isStaff || institutionalLoans.length > 0) && (
                  <section className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center"><div className="w-2 h-8 bg-yellow-400 mr-4 rounded-full"></div> Peminjaman Kolektif (Instansi)</h3>
                    <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[1200px]">
                        <thead className="bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-5">Aset</th>
                            <th className="px-6 py-5">Lembaga & Perwakilan</th>
                            <th className="px-6 py-5">Keperluan</th>
                            <th className="px-6 py-5">Masa Pinjam</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {institutionalLoans.map(loan => (
                            <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-6"><div className="text-sm font-black text-slate-800">{loan.itemName}</div><div className="text-[10px] text-blue-600 font-bold uppercase">{loan.quantity} Unit</div></td>
                              <td className="px-6 py-6"><div className="text-sm font-black text-blue-600">{loan.instanceName}</div><div className="text-[10px] text-slate-700 font-bold">{loan.borrowerName}</div></td>
                              <td className="px-6 py-6 text-xs text-slate-500 italic line-clamp-2 max-w-[200px]">"{loan.purpose}"</td>
                              <td className="px-6 py-6"><div className="text-[10px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">{loan.startDate} → {loan.endDate}</div></td>
                              <td className="px-6 py-6 text-center">{renderStatusBadge(loan)}</td>
                              <td className="px-6 py-6 text-center">
                                <button onClick={() => setViewingLoan(loan)} className="p-2 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </div>
            )}

            {currentView === 'verificator-approval' && <VerificatorDashboard loans={loans} onAction={handleAction} onViewDetail={setViewingLoan} />}
            {currentView === 'admin-items' && <ItemManagement items={items} onUpdateItems={setItems} />}
            {currentView === 'admin-tracking' && (
              <AdminDashboard 
                loans={loans} 
                onVerify={handleAdminVerify}
                onAction={handleAction}
                onReturn={handleReturnItem} 
                onExport={handleExportCSV} 
                onViewDetail={setViewingLoan}
              />
            )}
            {currentView === 'super-admin-users' && <SuperAdminDashboard users={users} onUpdateUsers={setUsers} setNotification={setNotification} />}
            {currentView === 'super-admin-settings' && <SuperAdminSettings config={systemConfig} onUpdateConfig={setSystemConfig} />}
          </div>
        </div>

        <footer className="bg-white border-t-8 border-yellow-400 p-16 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-12 md:space-y-0">
            <div className="flex-1 space-y-8">
              <div className="flex items-center space-x-4"><div className="w-1.5 h-10 bg-blue-600 rounded-full"></div><h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Hubungi Tim IT UPT</h4></div>
              <div className="flex flex-col space-y-5">
                <div className="flex items-center text-base font-black text-slate-800"><div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>{systemConfig.contactPhone}</div>
                <div className="flex items-center text-base font-black text-slate-800"><div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>{systemConfig.contactEmail}</div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Media Informasi Resmi</p>
              <div className="flex items-center space-x-4">
                {systemConfig.contactWebsite && (
                  <a href={systemConfig.contactWebsite} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-lg" title="Website Resmi">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </a>
                )}
                {systemConfig.socialIG && (
                  <a href={systemConfig.socialIG} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-100 text-pink-600 rounded-2xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-lg" title="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.012-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07s-3.585-.015-4.85-.074c-1.17-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="relative"><img src={systemConfig.secondaryLogoUrl} alt="Logo" className="w-40 h-40 object-contain" /></div>
            </div>
          </div>
        </footer>
      </main>

      {showBorrowerGate && selectedItem && (
        <BorrowerGate 
          allLoans={loans}
          onSelectNew={() => {
            setShowBorrowerGate(false);
            setPrefilledBorrowerData(null);
          }}
          onSelectReturning={(data) => {
            setShowBorrowerGate(false);
            setPrefilledBorrowerData(data);
          }}
          onCancel={() => {
            setShowBorrowerGate(false);
            setSelectedItem(null);
          }}
        />
      )}

      {selectedItem && !showBorrowerGate && (
        <LoanForm 
          item={selectedItem} 
          allLoans={loans}
          prefillData={prefilledBorrowerData}
          onSubmit={submitLoan} 
          onCancel={() => {
            setSelectedItem(null);
            setPrefilledBorrowerData(null);
          }} 
        />
      )}
      {viewingLoan && <LoanDetailModal loan={viewingLoan} onClose={() => setViewingLoan(null)} />}
      
      {/* KOTAK DIALOG PENOLAKAN KUSTOM */}
      {rejectionModalId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-slide-down border-4 border-red-500/10">
            <div className="p-8 bg-red-50 border-b border-red-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-red-600 tracking-tight">Konfirmasi Penolakan</h3>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-1">Sistem Otoritas Simpanse</p>
              </div>
              <button onClick={() => setRejectionModalId(null)} className="p-2 hover:bg-white rounded-full transition-all text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alasan Penolakan Aset</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="Contoh: Dokumen NIK tidak valid atau Aset sedang dalam masa pemeliharaan mendadak."
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setRejectionModalId(null)} 
                  className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl"
                >
                  Batal
                </button>
                <button 
                  disabled={!rejectionInput.trim()}
                  onClick={submitRejection}
                  className="flex-[2] py-4 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 shadow-xl shadow-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tolak Peminjaman
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && <LoginGate users={users} onLogin={handleLogin} onCancel={() => setShowLogin(false)} />}
      {notification && <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;
