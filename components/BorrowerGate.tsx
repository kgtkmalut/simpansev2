
import React, { useState } from 'react';
import { Loan } from '../types';

interface BorrowerGateProps {
  allLoans: Loan[];
  onSelectNew: () => void;
  onSelectReturning: (data: Partial<Loan>) => void;
  onCancel: () => void;
}

export const BorrowerGate: React.FC<BorrowerGateProps> = ({ allLoans, onSelectNew, onSelectReturning, onCancel }) => {
  const [step, setStep] = useState<'choice' | 'lookup'>('choice');
  const [email, setEmail] = useState('');
  const [nikSuffix, setNikSuffix] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLookup = () => {
    setIsVerifying(true);
    setError('');

    // Security Logic: Mencari data yang cocok dengan Email DAN 4 digit terakhir NIK
    const lastLoan = allLoans
      .filter(l => 
        l.borrowerEmail.toLowerCase() === email.toLowerCase() && 
        l.borrowerNIK.endsWith(nikSuffix)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    setTimeout(() => {
      if (lastLoan) {
        onSelectReturning(lastLoan);
      } else {
        setError('Kombinasi Email & 4 Digit NIK tidak ditemukan. Silahkan cek kembali atau pilih "Peminjam Baru".');
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-[250] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-slide-down border-4 border-white">
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-blue-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M3 9a9 9 0 0018 0V9a9 9 0 00-18 0v0zm6 12h6" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Verifikasi Keamanan Peminjam</h2>
          <p className="text-slate-500 text-sm font-medium mt-2 italic">Data Anda dilindungi oleh protokol enkripsi internal SIMPANSE.</p>

          {step === 'choice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <button 
                onClick={onSelectNew}
                className="group p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-600 hover:bg-blue-50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Peminjam Baru</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold leading-relaxed">Belum pernah terdaftar. Sistem akan merekam identitas Anda secara aman.</p>
              </button>

              <button 
                onClick={() => setStep('lookup')}
                className="group p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-left hover:border-emerald-600 hover:bg-emerald-50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11v5m0 0l-2-2m2 2l2-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Peminjam Terdaftar</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold leading-relaxed">Verifikasi identitas untuk menarik riwayat peminjaman lama Anda.</p>
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-5 animate-slide-down text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
                <input 
                  type="email"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none font-bold text-slate-800"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4 Digit Terakhir NIK (Sebagai Password)</label>
                <input 
                  type="password"
                  maxLength={4}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none font-black text-slate-800 tracking-[1em] text-center"
                  placeholder="••••"
                  value={nikSuffix}
                  onChange={(e) => setNikSuffix(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[11px] text-red-600 font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button disabled={isVerifying} onClick={() => setStep('choice')} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kembali</button>
                <button 
                  disabled={isVerifying || !email || nikSuffix.length < 4}
                  onClick={handleLookup}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isVerifying ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Verifikasi & Lanjutkan'}
                </button>
              </div>
            </div>
          )}

          <button 
            disabled={isVerifying}
            onClick={onCancel}
            className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Batalkan Akses
          </button>
        </div>
      </div>
    </div>
  );
};
