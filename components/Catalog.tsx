
import React, { useState, useEffect, useMemo } from 'react';
import { Item, ItemStatus, Loan, SliderItem } from '../types';

interface CatalogProps {
  items: Item[];
  onBorrow: (item: Item) => void;
  userLoans: Loan[];
  sliders: SliderItem[];
}

const HeroSlider: React.FC<{ items: SliderItem[] }> = ({ items }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const getTransitionClass = (type: string, active: boolean) => {
    if (!active) return 'opacity-0 scale-95 pointer-events-none';
    
    switch (type) {
      case 'zoom': return 'animate-zoom-in';
      case 'flip': return 'animate-flip-in';
      case 'bounce': return 'animate-bounce-in';
      case 'rotate': return 'animate-rotate-in';
      case 'slide': return 'animate-slide-in';
      case 'slideUp': return 'animate-slide-up';
      default: return 'animate-fade-in';
    }
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[600px] overflow-hidden rounded-[3rem] bg-slate-200 mb-12 shadow-2xl border-4 border-white">
      {items.map((item, idx) => (
        <div 
          key={item.id} 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${getTransitionClass(item.transition, idx === current)}`}
        >
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent flex flex-col justify-end p-12 lg:p-20">
            <div className="flex items-center space-x-4 mb-4">
               <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
               <span className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs">Featured Asset</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl max-w-3xl">
              {item.title}
            </h2>
            <div className="w-24 h-2 bg-yellow-400 mt-6 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        {items.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)}
            className={`h-2 transition-all rounded-full ${idx === current ? 'w-10 bg-yellow-400' : 'w-2 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Catalog: React.FC<CatalogProps> = ({ items, onBorrow, userLoans, sliders }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Extract unique categories from items
  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map(item => item.category)));
    return ['Semua', ...unique];
  }, [items]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isInQueue = (itemId: string) => {
    return userLoans.some(l => l.itemId === itemId);
  };

  return (
    <div className="animate-slide-down pb-20">
      <div className="p-8 pb-0">
        <HeroSlider items={sliders} />
      </div>

      <div className="px-8 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center bg-blue-600 p-8 lg:p-10 rounded-[2.5rem] border-4 border-white shadow-xl relative overflow-hidden gap-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl font-black text-white tracking-tight">Katalog Aset Utama</h2>
            <p className="text-blue-100 font-medium mt-1">Gunakan aset kantor dengan mudah dan cepat.</p>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-yellow-400 text-blue-900 shadow-lg shadow-yellow-400/20' 
                      : 'bg-blue-700/50 text-blue-200 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group z-10 min-w-[320px]">
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/40 focus:border-yellow-400 w-full text-sm font-bold transition-all shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-6 h-6 text-blue-400 absolute left-4 top-4 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aset tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const drafted = isInQueue(item.id);
              return (
                <div key={item.id} className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all hover:-translate-y-2 group flex flex-col">
                  <div className="h-56 w-full overflow-hidden relative">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=800'} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-xl tracking-widest w-fit shadow-md backdrop-blur-md ${
                        item.status === ItemStatus.READY ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                      {drafted && (
                        <span className="bg-yellow-400 text-blue-900 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-md backdrop-blur-md border border-white/20">
                          Dalam Antrian
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4">
                       <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest bg-yellow-400 px-4 py-1.5 rounded-xl border-2 border-white shadow-lg">{item.category}</span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <div className="flex items-center text-sm text-slate-400 mb-6 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2 text-blue-500">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      {item.rentalPrice > 0 ? `Rp ${item.rentalPrice.toLocaleString()}` : 'Bebas Sewa (Internal)'}
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex flex-col space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                           <span className="uppercase tracking-widest">Ketersediaan Unit</span>
                           <span className="text-blue-600 font-black">{item.availableQuantity} / {item.totalQuantity}</span>
                         </div>
                         <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-50">
                           <div 
                              className={`h-full transition-all duration-700 rounded-full ${item.availableQuantity > 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-slate-300'}`} 
                              style={{ width: `${(item.availableQuantity / item.totalQuantity) * 100}%` }}
                           ></div>
                         </div>
                      </div>

                      <button
                        disabled={item.status !== ItemStatus.READY}
                        onClick={() => onBorrow(item)}
                        className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          item.status === ItemStatus.READY 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:shadow-yellow-400/20 active:scale-[0.98] border-b-4 border-blue-800 active:border-b-0' 
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border-b-4 border-slate-200'
                        }`}
                      >
                        {item.status === ItemStatus.READY ? (drafted ? 'Selesaikan Form' : 'Pinjam Sekarang') : 'Habis Terpinjam'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }
        @keyframes flipIn { from { opacity: 0; transform: rotateY(90deg); } to { opacity: 1; transform: rotateY(0); } }
        @keyframes bounceIn { 
          0% { opacity: 0; transform: scale(0.3); } 
          50% { opacity: 0.9; transform: scale(1.1); } 
          100% { opacity: 1; transform: scale(1); } 
        }
        @keyframes rotateIn { from { opacity: 0; transform: rotate(-10deg); } to { opacity: 1; transform: rotate(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 1.2s cubic-bezier(0.2, 0, 0.2, 1) forwards; }
        .animate-flip-in { animation: flipIn 0.8s ease-out forwards; backface-visibility: hidden; }
        .animate-bounce-in { animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
        .animate-rotate-in { animation: rotateIn 1s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};
