
import React from 'react';
import { Loan } from '../types';

interface LoanDetailModalProps {
  loan: Loan;
  onClose: () => void;
}

export const LoanDetailModal: React.FC<LoanDetailModalProps> = ({ loan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-slide-down border-4 border-white">
        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Detail Permintaan Peminjaman</h2>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">ID Transaksi: {loan.id}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Barang / Aset</p>
              <p className="text-lg font-black text-blue-900">{loan.itemName}</p>
              <p className="text-xs font-bold text-blue-600 mt-1">{loan.quantity} Unit</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Saat Ini</p>
              <div className="mt-1 flex items-center">
                 <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-xl tracking-widest ${
                    loan.status === 'Approved' ? 'bg-emerald-500 text-white' : 
                    loan.status === 'Rejected' ? 'bg-red-500 text-white' : 
                    loan.status === 'Verified' ? 'bg-blue-600 text-white' : 'bg-yellow-400 text-blue-900'
                  }`}>
                    {loan.status}
                  </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-slate-800 pl-3">Identitas & Dokumen Peminjam ({loan.borrowerType})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div className="col-span-1 md:col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase">Foto KTP / Identitas</p>
                <div className="mt-2 w-full h-48 bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  {loan.idCardPhoto ? (
                    <img src={loan.idCardPhoto} alt="KTP" className="w-full h-full object-contain cursor-zoom-in" onClick={() => window.open(loan.idCardPhoto, '_blank')} />
                  ) : (
                    <p className="text-xs text-slate-300 italic">Foto identitas tidak diunggah</p>
                  )}
                </div>
              </div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase">Nama Lengkap</p><p className="text-sm font-bold text-slate-800">{loan.borrowerName}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase">NIP / NIK</p><p className="text-sm font-bold text-slate-800">{loan.borrowerNIK}</p></div>
              <div className="col-span-1 md:col-span-2"><p className="text-[10px] font-black text-slate-400 uppercase">Alamat Peminjam</p><p className="text-sm font-bold text-slate-800">{loan.borrowerAddress || '-'}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase">Email</p><p className="text-sm font-bold text-slate-800">{loan.borrowerEmail}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase">No. HP / WhatsApp</p><p className="text-sm font-bold text-slate-800">{loan.borrowerPhone}</p></div>
            </div>
          </div>

          {loan.borrowerType === 'Instansi' && (
            <div className="space-y-4 animate-slide-down">
              <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest border-l-4 border-amber-500 pl-3">Data Instansi / Lembaga</h3>
              <div className="space-y-4 p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black text-amber-700/60 uppercase">Nama Instansi</p><p className="text-sm font-bold text-amber-900">{loan.instanceName}</p></div>
                  <div><p className="text-[10px] font-black text-amber-700/60 uppercase">Email Instansi</p><p className="text-sm font-bold text-amber-900">{loan.instanceEmail}</p></div>
                </div>
                <div><p className="text-[10px] font-black text-amber-700/60 uppercase">Alamat Instansi</p><p className="text-sm font-bold text-amber-900">{loan.instanceAddress}</p></div>
                <div><p className="text-[10px] font-black text-amber-700/60 uppercase">Kontak Instansi</p><p className="text-sm font-bold text-amber-900">{loan.instancePhone}</p></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Keperluan & Durasi</h3>
            <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-700/60 uppercase mb-1">Maksud Peminjaman</p>
              <p className="text-sm text-slate-700 italic leading-relaxed">"{loan.purpose}"</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div><p className="text-[10px] font-black text-emerald-700/60 uppercase">Tanggal Mulai</p><p className="text-sm font-bold text-slate-800">{loan.startDate}</p></div>
                <div><p className="text-[10px] font-black text-emerald-700/60 uppercase">Tanggal Kembali</p><p className="text-sm font-bold text-slate-800">{loan.endDate}</p></div>
              </div>
            </div>
          </div>

          {loan.status === 'Rejected' && loan.rejectionReason && (
            <div className="space-y-4 animate-slide-down">
              <h3 className="text-xs font-black text-red-600 uppercase tracking-widest border-l-4 border-red-500 pl-3">Alasan Penolakan</h3>
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-sm font-bold text-red-800">{loan.rejectionReason}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-slate-800 pl-3">Tanda Tangan Pengesahan</h3>
            <div className="p-6 bg-slate-100 rounded-3xl flex flex-col items-center">
              {loan.signature ? (<img src={loan.signature} alt="Signature" className="max-h-32 object-contain" />) : (<p className="text-xs text-slate-400 italic">Tanda tangan tidak tersedia</p>)}
              <p className="text-[10px] font-black text-slate-400 uppercase mt-4">Peminjam: {loan.borrowerName}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100">Tutup Detail</button>
        </div>
      </div>
    </div>
  );
};
