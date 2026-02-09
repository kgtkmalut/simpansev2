
import React, { useState } from 'react';
import { SystemConfig, SliderItem, TransitionType } from '../types';

interface SuperAdminSettingsProps {
  config: SystemConfig;
  onUpdateConfig: (config: SystemConfig) => void;
}

export const SuperAdminSettings: React.FC<SuperAdminSettingsProps> = ({ config, onUpdateConfig }) => {
  const [localConfig, setLocalConfig] = useState<SystemConfig>(config);
  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'sliders'>('branding');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'secondaryLogoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig({ ...localConfig, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig({
          ...localConfig,
          sliders: localConfig.sliders.map(s => s.id === id ? { ...s, url: reader.result as string } : s)
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSlider = (id: string, updates: Partial<SliderItem>) => {
    setLocalConfig({
      ...localConfig,
      sliders: localConfig.sliders.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const addNewSlider = () => {
    if (localConfig.sliders.length >= 7) return;
    const newSlide: SliderItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920&h=700',
      title: 'Slide Baru',
      transition: 'fade'
    };
    setLocalConfig({ ...localConfig, sliders: [...localConfig.sliders, newSlide] });
  };

  const removeSlider = (id: string) => {
    setLocalConfig({ ...localConfig, sliders: localConfig.sliders.filter(s => s.id !== id) });
  };

  const saveConfig = () => {
    onUpdateConfig(localConfig);
    alert('Pengaturan sistem berhasil diperbarui secara permanen!');
  };

  return (
    <div className="space-y-8 animate-slide-down">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Visual & Info Sistem</h2>
          <p className="text-slate-500 text-sm font-medium">Kustomisasi logo, branding, kontak UPT, dan slider utama.</p>
        </div>
        <button 
          onClick={saveConfig} 
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          Simpan Perubahan
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-50 overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('branding')} className={`flex-1 min-w-[150px] py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'branding' ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}>Logo & Nama</button>
          <button onClick={() => setActiveTab('contact')} className={`flex-1 min-w-[150px] py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contact' ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}>Kontak & Sosmed</button>
          <button onClick={() => setActiveTab('sliders')} className={`flex-1 min-w-[150px] py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sliders' ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}>Slider ({localConfig.sliders.length}/7)</button>
        </div>

        <div className="p-10">
          {activeTab === 'branding' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Aplikasi</label><input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800" value={localConfig.appName} onChange={(e) => setLocalConfig({...localConfig, appName: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">Logo Utama (Sidebar) <span className="text-blue-500">Rek. 1024x1024px</span></label><div className="flex items-center space-x-4"><div className="w-40 h-40 bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shadow-inner"><img src={localConfig.logoUrl} alt="Logo Preview" className="w-32 h-32 object-contain" /></div><label className="flex-1"><div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center cursor-pointer hover:bg-slate-100 transition-colors text-xs font-bold text-slate-500">Klik untuk Ganti Logo Utama</div><input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleLogoUpload(e, 'logoUrl')} /></label></div></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">Logo Sekunder (Tut Wuri / Footer) <span className="text-blue-500">Rek. 1024x1024px</span></label><div className="flex items-center space-x-4"><div className="w-40 h-40 bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shadow-inner"><img src={localConfig.secondaryLogoUrl} alt="Secondary Logo Preview" className="w-32 h-32 object-contain" /></div><label className="flex-1"><div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center cursor-pointer hover:bg-slate-100 transition-colors text-xs font-bold text-slate-500">Klik untuk Ganti Logo Sekunder</div><input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleLogoUpload(e, 'secondaryLogoUrl')} /></label></div></div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Preview Visual Branding</p><div className="w-72 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center"><img src={localConfig.logoUrl} className="w-32 h-32 object-contain mb-4" /><h3 className="text-2xl font-black text-blue-600 tracking-tighter">{localConfig.appName}</h3><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Peminjaman Aset</p></div></div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-down">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">Informasi Kontak UPT</h3>
                <div className="space-y-4">
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Nomor HP / WhatsApp</label><input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.contactPhone} onChange={(e) => setLocalConfig({...localConfig, contactPhone: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Email Resmi</label><input type="email" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.contactEmail} onChange={(e) => setLocalConfig({...localConfig, contactEmail: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Website Resmi</label><input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.contactWebsite} onChange={(e) => setLocalConfig({...localConfig, contactWebsite: e.target.value})} /></div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] border-l-4 border-emerald-600 pl-4">Tautan Sosial Media</h3>
                <div className="space-y-4">
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Facebook Link</label><input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.socialFB} onChange={(e) => setLocalConfig({...localConfig, socialFB: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">Instagram Link</label><input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.socialIG} onChange={(e) => setLocalConfig({...localConfig, socialIG: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase">YouTube Channel Link</label><input type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={localConfig.socialYT} onChange={(e) => setLocalConfig({...localConfig, socialYT: e.target.value})} /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sliders' && (
            <div className="space-y-8 animate-slide-down">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-blue-50/50 p-6 rounded-3xl border border-blue-100 gap-4 mb-4"><div><h3 className="text-sm font-black text-blue-800 uppercase tracking-tight">Katalog Slide Aktif</h3><p className="text-blue-600 text-[11px] font-medium">Resolusi Rekomendasi: <span className="font-black">1920 x 700 px</span></p></div>{localConfig.sliders.length < 7 && (<button onClick={addNewSlider} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">+ Tambah Slide Baru</button>)}</div>
              <div className="grid grid-cols-1 gap-6">
                {localConfig.sliders.map((slider, idx) => (
                  <div key={slider.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 hover:shadow-lg transition-all group"><div className="relative w-full md:w-64 h-32 rounded-2xl overflow-hidden shadow-sm bg-slate-200"><img src={slider.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest text-center px-4">Ganti Gambar<input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleSliderUpload(e, slider.id)} /></label></div><div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Judul Slide {idx + 1}</label><input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={slider.title} onChange={(e) => updateSlider(slider.id, { title: e.target.value })} /></div><div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Efek Transisi</label><select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" value={slider.transition} onChange={(e) => updateSlider(slider.id, { transition: e.target.value as TransitionType })}><option value="fade">Smooth Fade</option><option value="slide">Horizontal Slide</option><option value="zoom">Immersive Zoom</option><option value="flip">Flip 3D</option><option value="bounce">Bounce Back</option><option value="rotate">Soft Rotate</option><option value="slideUp">Slide Upward</option></select></div></div><div className="flex items-end"><button onClick={() => removeSlider(slider.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Hapus Slide"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
