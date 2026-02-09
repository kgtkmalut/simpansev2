
import React, { useState, useRef, useEffect } from 'react';
import { Item, BorrowerType, Loan } from '../types';

interface LoanFormProps {
  item: Item;
  allLoans: Loan[];
  onSubmit: (formData: any, status: 'Pending' | 'Queued') => void;
  onCancel: () => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({ item, allLoans, onSubmit, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [foundDraft, setFoundDraft] = useState<Loan | null>(null);
  const [borrowCount, setBorrowCount] = useState(0);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerNIK: '',
    borrowerAddress: '',
    idCardPhoto: '',
    borrowerType: 'Pribadi' as BorrowerType,
    instanceName: '',
    instanceAddress: '',
    instancePhone: '',
    instanceEmail: '',
    borrowerEmail: '',
    borrowerPhone: '',
    purpose: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    quantity: 1,
    termsAccepted: false
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('sip_session_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, borrowerEmail: savedEmail }));
      setTimeout(() => { handleEmailLookup(savedEmail); }, 100);
    }
  }, []);

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, idCardPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const drawSignatureFromData = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && dataUrl) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          setHasSignature(true);
        };
        img.src = dataUrl;
      }
    }
  };

  const handleEmailLookup = (manualEmail?: string) => {
    const emailToSearch = manualEmail || formData.borrowerEmail;
    if (!emailToSearch) return;
    const emailLower = emailToSearch.toLowerCase();

    const draft = allLoans.find(l => 
      l.borrowerEmail.toLowerCase() === emailLower && 
      l.itemId === item.id && 
      l.status === 'Queued'
    );

    const lastLoan = allLoans
      .filter(l => l.borrowerEmail.toLowerCase() === emailLower && l.status !== 'Queued')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const history = allLoans.filter(l => 
      l.borrowerEmail.toLowerCase() === emailLower && 
      l.itemId === item.id && 
      (l.status === 'Approved' || l.status === 'Returned')
    ).length;

    setBorrowCount(history);
    setFoundDraft(draft || null);

    if (lastLoan && !formData.borrowerName) {
      setFormData(prev => ({
        ...prev,
        borrowerEmail: emailToSearch,
        borrowerName: lastLoan.borrowerName,
        borrowerNIK: lastLoan.borrowerNIK,
        borrowerAddress: lastLoan.borrowerAddress || '',
        borrowerType: lastLoan.borrowerType,
        borrowerPhone: lastLoan.borrowerPhone,
        instanceName: lastLoan.instanceName || '',
        instanceAddress: lastLoan.instanceAddress || '',
        instancePhone: lastLoan.instancePhone || '',
        instanceEmail: lastLoan.instanceEmail || '',
        idCardPhoto: lastLoan.idCardPhoto || ''
      }));
      setIsAutoFilled(true);
      if (lastLoan.signature) drawSignatureFromData(lastLoan.signature);
      setTimeout(() => setIsAutoFilled(false), 3000);
    }
  };

  const restoreDraft = () => {
    if (!foundDraft) return;
    setFormData({
      ...formData,
      borrowerName: foundDraft.borrowerName,
      borrowerNIK: foundDraft.borrowerNIK,
      borrowerAddress: foundDraft.borrowerAddress,
      borrowerType: foundDraft.borrowerType,
      instanceName: foundDraft.instanceName || '',
      instanceAddress: foundDraft.instanceAddress || '',
      instancePhone: foundDraft.instancePhone || '',
      instanceEmail: foundDraft.instanceEmail || '',
      borrowerPhone: foundDraft.borrowerPhone,
      purpose: foundDraft.purpose,
      startDate: foundDraft.startDate,
      endDate: foundDraft.endDate,
      quantity: foundDraft.quantity || 1,
      idCardPhoto: foundDraft.idCardPhoto || ''
    });
    
    if (foundDraft.signature) { drawSignatureFromData(foundDraft.signature); }
    setFoundDraft(null);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDrawing = () => setIsDrawing(false);
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    if (!hasSignature) setHasSignature(true);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      setHasSignature(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent, status: 'Pending' | 'Queued') => {
    e.preventDefault();
    if (status === 'Pending' && (!formData.termsAccepted || !hasSignature)) return;
    const signatureBase64 = canvasRef.current?.toDataURL() || '';
    onSubmit({ ...formData, itemId: item.id, itemName: item.name, signature: signatureBase64 }, status);
  };

  const recentActivity = allLoans
    .filter(l => l.itemId === item.id && l.status === 'Returned')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-slide-down border-4 border-white">
        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Formulir Peminjaman</h2>
              {borrowCount > 0 && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                  Loyal Peminjam ({borrowCount}x)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">Aset: <span className="text-blue-600 font-bold">{item.name}</span></p>
          </div>
          <button onClick={onCancel} className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {recentActivity.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-slate-200 pl-3">Aktivitas Terakhir Aset</h3>
              <div className="space-y-2">
                {recentActivity.map(act => (
                  <div key={act.id} className="flex items-center space-x-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600"><span className="text-slate-800">{act.borrowerName}</span> baru saja mengembalikan {act.quantity} unit ini.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Identifikasi Peminjam</h3>
               {isAutoFilled && <span className="text-[10px] font-bold text-emerald-600 animate-pulse">✓ Profil Disinkronkan</span>}
            </div>
            <div className="relative">
              <input type="email" required className="w-full px-5 py-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-blue-900 placeholder:text-blue-300" value={formData.borrowerEmail} onBlur={() => handleEmailLookup()} onChange={(e) => setFormData({...formData, borrowerEmail: e.target.value})} placeholder="Masukkan email Anda..." />
              <div className="absolute right-4 top-4 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
              </div>
            </div>
            
            {foundDraft && (
              <div className="bg-amber-50 p-4 rounded-2xl flex items-center justify-between border border-amber-200 animate-slide-down shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mr-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="text-xs font-bold text-amber-800">Ada Antrian "Pinjam Nanti"!</p><p className="text-[10px] text-amber-600">Lanjutkan pengisian yang tertunda untuk aset ini.</p></div>
                </div>
                <button type="button" onClick={restoreDraft} className="px-4 py-2 bg-amber-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all">Pulihkan</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-slate-800 pl-3">Data Identitas & Dokumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.borrowerName} onChange={(e) => setFormData({...formData, borrowerName: e.target.value})} placeholder="Sesuai KTP" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">NIP / NIK</label>
                <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.borrowerNIK} onChange={(e) => setFormData({...formData, borrowerNIK: e.target.value})} placeholder="Nomor Induk" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Alamat Lengkap Peminjam</label>
              <textarea required rows={2} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" value={formData.borrowerAddress} onChange={(e) => setFormData({...formData, borrowerAddress: e.target.value})} placeholder="Masukkan alamat sesuai KTP atau domisili saat ini..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Foto KTP / Kartu Identitas</label>
              <div className="relative group w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300">
                {formData.idCardPhoto ? (
                  <img src={formData.idCardPhoto} className="w-full h-full object-contain" alt="KTP Preview" />
                ) : (
                  <div className="text-center text-slate-300">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[10px] font-black uppercase">Unggah Foto KTP</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleIdCardUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Kategori Peminjam</label>
              <div className="flex space-x-4">
                <label className={`flex-1 flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.borrowerType === 'Pribadi' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 grayscale opacity-60'}`}>
                  <input type="radio" className="hidden" name="bType" value="Pribadi" checked={formData.borrowerType === 'Pribadi'} onChange={() => setFormData({...formData, borrowerType: 'Pribadi'})} />
                  <span className="text-sm font-bold text-slate-700">Perorangan / Pribadi</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.borrowerType === 'Instansi' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 grayscale opacity-60'}`}>
                  <input type="radio" className="hidden" name="bType" value="Instansi" checked={formData.borrowerType === 'Instansi'} onChange={() => setFormData({...formData, borrowerType: 'Instansi'})} />
                  <span className="text-sm font-bold text-slate-700">Lembaga / Instansi</span>
                </label>
              </div>
            </div>
          </div>

          {formData.borrowerType === 'Instansi' && (
            <div className="space-y-4 animate-slide-down">
              <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest border-l-4 border-amber-500 pl-3">Data Instansi</h3>
              <div className="space-y-4 p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700/60 uppercase ml-1">Nama Instansi</label><input required={formData.borrowerType === 'Instansi'} className="w-full px-5 py-3 bg-white border border-amber-200 rounded-2xl outline-none" value={formData.instanceName} onChange={(e) => setFormData({...formData, instanceName: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700/60 uppercase ml-1">Alamat Lengkap Instansi</label><textarea required={formData.borrowerType === 'Instansi'} rows={2} className="w-full px-5 py-3 bg-white border border-amber-200 rounded-2xl outline-none resize-none" value={formData.instanceAddress} onChange={(e) => setFormData({...formData, instanceAddress: e.target.value})} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700/60 uppercase ml-1">Kontak Instansi</label><input required={formData.borrowerType === 'Instansi'} className="w-full px-5 py-3 bg-white border border-amber-200 rounded-2xl outline-none" value={formData.instancePhone} onChange={(e) => setFormData({...formData, instancePhone: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700/60 uppercase ml-1">Email Instansi</label><input type="email" required={formData.borrowerType === 'Instansi'} className="w-full px-5 py-3 bg-white border border-amber-200 rounded-2xl outline-none" value={formData.instanceEmail} onChange={(e) => setFormData({...formData, instanceEmail: e.target.value})} /></div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-slate-800 pl-3">Konfigurasi Unit & Waktu</h3>
            <div className="flex items-center space-x-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex-1"><p className="text-sm font-bold text-slate-800">Jumlah Unit</p><p className="text-xs text-slate-500">Stok tersedia: <span className="font-bold text-blue-600">{item.availableQuantity} Unit</span></p></div>
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                <button type="button" onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
                <input type="number" className="w-16 text-center font-black text-slate-800 outline-none" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Math.min(item.availableQuantity, Math.max(1, parseInt(e.target.value) || 1))})} />
                <button type="button" onClick={() => setFormData({...formData, quantity: Math.min(item.availableQuantity, formData.quantity + 1)})} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tanggal Mulai</label><input type="date" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tanggal Pengembalian</label><input type="date" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} /></div>
            </div>
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">No. HP / WhatsApp (Aktif)</label><input required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.borrowerPhone} onChange={(e) => setFormData({...formData, borrowerPhone: e.target.value})} placeholder="0812..." /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Maksud Peminjaman</label><textarea required rows={3} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="Tuliskan alasan peminjaman secara detail..." /></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-slate-800 pl-3">Tanda Tangan Elektronik</h3>
            <div className="relative group">
              <canvas ref={canvasRef} width={600} height={200} onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchEnd={stopDrawing} onTouchMove={draw} className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-crosshair transition-colors group-hover:border-blue-300" />
              <div className="absolute top-4 right-4 flex space-x-2"><button type="button" onClick={clearSignature} className="px-3 py-1.5 bg-white shadow-sm border border-slate-100 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-50 transition-all uppercase">Bersihkan</button></div>
              {!hasSignature && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><span className="text-xs font-medium text-slate-400 italic">Gunakan mouse atau sentuhan untuk tanda tangan di sini</span></div>}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100"><label className="flex items-start cursor-pointer group"><div className="relative flex items-center"><input type="checkbox" className="w-6 h-6 border-2 border-slate-200 rounded-lg text-blue-600 focus:ring-0 transition-all cursor-pointer" checked={formData.termsAccepted} onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})} /></div><span className="ml-4 text-[11px] text-slate-500 leading-relaxed font-medium">Saya <span className="text-slate-800 font-bold uppercase">{formData.borrowerName || '(Peminjam)'}</span> menyatakan bertanggung jawab penuh atas integritas dan kondisi barang selama masa peminjaman.</span></label></div>

          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex space-x-3">
              <button type="button" onClick={(e) => handleFormSubmit(e, 'Queued')} className="flex-1 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Pinjam Nanti</button>
              <button type="button" onClick={(e) => handleFormSubmit(e, 'Pending')} disabled={!formData.termsAccepted || !hasSignature} className={`flex-[2] py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-xl ${formData.termsAccepted && hasSignature ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 scale-[1.02] active:scale-100' : 'bg-slate-300 cursor-not-allowed opacity-70'}`}>Kirim Pengajuan</button>
            </div>
            <button type="button" onClick={onCancel} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 flex items-center justify-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Batal Pinjam</button>
          </div>
        </form>
      </div>
    </div>
  );
};
