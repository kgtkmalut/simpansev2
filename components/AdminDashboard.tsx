
import React, { useState } from 'react';
import { Loan, LoanStatus } from '../types';

interface AdminDashboardProps {
  loans: Loan[];
  onVerify: (loanId: string) => void;
  onAction: (loanId: string, status: LoanStatus) => void;
  onReturn: (loanId: string) => void;
  onExport: () => void;
  onViewDetail: (loan: Loan) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ loans, onVerify, onAction, onReturn, onExport, onViewDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LoanStatus | 'All'>('All');
  
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loan.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || loan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-slide-down">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Persetujuan & Log</h2>
          <p className="text-slate-500 text-sm font-medium">Verifikasi data peminjam sebelum diproses Verifikator.</p>
        </div>
        <button onClick={onExport} className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Unduh CSV</button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <input 
            type="text" 
            placeholder="Cari peminjam..." 
            className="w-full lg:w-96 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {['All', 'Pending', 'Verified', 'Approved', 'Rejected', 'ReviewRequired'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s as any)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{s === 'All' ? 'Semua' : s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Identitas</th>
                <th className="px-8 py-5">Aset</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-800">{loan.borrowerName}</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">NIK: {loan.borrowerNIK}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-700">{loan.itemName}</div>
                    <div className="text-[10px] text-slate-400 italic">"{loan.purpose}"</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-xl ${
                      loan.status === 'Approved' ? 'bg-emerald-500 text-white' : 
                      loan.status === 'Verified' ? 'bg-blue-600 text-white' : 
                      loan.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => onViewDetail(loan)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all mr-2" title="Lihat Detail Menyeluruh">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    {loan.status === 'Pending' && (
                      <>
                        <button onClick={() => onVerify(loan.id)} className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-blue-700 transition-all">Verifikasi Data</button>
                        <button onClick={() => onAction(loan.id, 'Rejected')} className="px-4 py-2 border-2 border-red-500 text-red-500 text-[9px] font-black uppercase rounded-xl hover:bg-red-50">Tolak</button>
                      </>
                    )}
                    {loan.status === 'Verified' && (
                      <button onClick={() => onAction(loan.id, 'Rejected')} className="px-4 py-2 border-2 border-red-500 text-red-500 text-[9px] font-black uppercase rounded-xl hover:bg-red-50">Tolak</button>
                    )}
                    {loan.status === 'Approved' && (
                      <button onClick={() => onReturn(loan.id)} className="px-4 py-2 bg-slate-800 text-white text-[9px] font-black uppercase rounded-xl">Barang Kembali</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
