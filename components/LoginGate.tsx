
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';

interface LoginGateProps {
  users: UserAccount[];
  onLogin: (role: UserRole) => void;
  onCancel: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ users, onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );

    if (user) {
      onLogin(user.role);
    } else {
      setError('Kredensial tidak ditemukan atau password salah.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === forgotEmail);
    if (user) {
      setResetSuccess(true);
      setTimeout(() => {
        setView('login');
        setResetSuccess(false);
      }, 3000);
    } else {
      setError('Email tidak terdaftar di sistem.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (view === 'forgot') {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-slide-down">
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Lupa Password?</h2>
            <p className="text-slate-500 text-sm mb-8">Sistem akan mengirimkan instruksi reset ke email terdaftar Anda.</p>

            {resetSuccess ? (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold animate-bounce-in mb-4">
                Instruksi reset telah dikirim ke email Anda!
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
                  <input
                    type="email"
                    required
                    className={`w-full px-6 py-4 border ${error ? 'border-red-500' : 'border-slate-100'} bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold`}
                    placeholder="nama@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-[10px] ml-1 font-bold">{error}</p>}
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Kirim Reset Link</button>
              </form>
            )}
            <button onClick={() => setView('login')} className="mt-6 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">Kembali ke Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-slide-down">
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Akses Sistem</h2>
          <p className="text-slate-500 text-sm mb-8">Masuk sebagai staf operasional SIMPANSE.</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username / Email</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                placeholder="ID Pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-6 py-4 pr-14 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-[10px] ml-1 font-bold italic animate-pulse">{error}</p>}
            
            <div className="flex justify-end pt-1">
              <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Lupa Password?</button>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Otorisasi Masuk
            </button>
            <button type="button" onClick={onCancel} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors text-center">Batalkan</button>
          </form>
        </div>
      </div>
    </div>
  );
};
