
import React from 'react';
import { Loan, LoanStatus } from '../types';

interface VerificatorDashboardProps {
  loans: Loan[];
  onAction: (loanId: string, status: LoanStatus) => void;
  onViewDetail: (loan: Loan) => void;
}

export const VerificatorDashboard: React.FC<VerificatorDashboardProps> = ({ loans, onAction, onViewDetail }) => {
  const verifiedLoans = loans.filter(l => l.status === 'Verified' || l.status === 'ReviewRequired');

  return (
    <div className="space-y-6 animate-slide-down">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Otoritas Persetujuan</h2>
          <p className="text-slate-500 text-sm">Berikan izin peminjaman akhir untuk data yang sudah diverifikasi Admin.</p>
        </div>
        <div className="bg-blue-600 px-6 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
          {verifiedLoans.length} Antrian Menunggu Otoritas
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Data Peminjam</th>
              <th className="px-8 py-5">Aset Utama</th>
              <th className="px-8 py-5">Keperluan & Periode</th>
              <th className="px-8 py-5 text-right">Opsi Keputusan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {verifiedLoans.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-300 italic font-medium">Belum ada pengajuan yang diverifikasi Admin.</td></tr>
            ) : (
              verifiedLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-800">{loan.borrowerName}</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase">{loan.borrowerType}</div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-700">{loan.itemName} ({loan.quantity} Unit)</td>
                  <td className="px-8 py-6">
                    <div className="text-xs text-slate-600 italic line-clamp-1">"{loan.purpose}"</div>
                    <div className="text-[9px] text-slate-400 font-black mt-1 uppercase">{loan.startDate} s/d {loan.endDate}</div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => onViewDetail(loan)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all mr-2" title="Lihat Detail Menyeluruh">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button onClick={() => onAction(loan.id, 'Approved')} className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600">Beri Izin Peminjaman</button>
                    <button onClick={() => onAction(loan.id, 'ReviewRequired')} className="px-4 py-2 bg-yellow-400 text-blue-900 text-[9px] font-black uppercase rounded-xl shadow-lg shadow-yellow-100 hover:bg-yellow-500">Masih Butuh Pertimbangan</button>
                    <button onClick={() => onAction(loan.id, 'Rejected')} className="px-4 py-2 border-2 border-red-500 text-red-500 text-[9px] font-black uppercase rounded-xl hover:bg-red-50">Tolak</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
