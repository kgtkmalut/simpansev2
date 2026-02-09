
import React, { useState } from 'react';
import { Item, ItemStatus } from '../types';

interface ItemManagementProps {
  items: Item[];
  onUpdateItems: (items: Item[]) => void;
}

export const ItemManagement: React.FC<ItemManagementProps> = ({ items, onUpdateItems }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      status: editingItem.availableQuantity > 0 ? ItemStatus.READY : ItemStatus.OUT_OF_STOCK
    };

    if (items.find(i => i.id === updatedItem.id)) {
      onUpdateItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
    } else {
      onUpdateItems([...items, updatedItem]);
    }
    setEditingItem(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteItem = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini secara permanen dari sistem?')) {
      onUpdateItems(items.filter(i => i.id !== id));
    }
  };

  const totalStock = items.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const totalAvailable = items.reduce((acc, curr) => acc + curr.availableQuantity, 0);

  return (
    <div className="space-y-8 animate-slide-down">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gudang & Master Barang</h2>
          <p className="text-slate-500 text-sm font-medium">Atur inventaris, stok tersedia, dan biaya sewa.</p>
        </div>
        <button
          onClick={() => setEditingItem({ 
            id: Math.random().toString(36).substr(2, 9), 
            name: '', 
            category: 'Elektronik', 
            rentalPrice: 0, 
            status: ItemStatus.READY, 
            totalQuantity: 1, 
            availableQuantity: 1,
            imageUrl: ''
          })}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          + Registrasi Barang Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center space-x-6 shadow-sm">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Unit Inventaris</p>
             <p className="text-3xl font-black text-slate-800">{totalStock} <span className="text-xs font-bold text-slate-400">Pcs</span></p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center space-x-6 shadow-sm">
           <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Siap Pinjam</p>
             <p className="text-3xl font-black text-emerald-600">{totalAvailable} <span className="text-xs font-bold text-slate-400">Pcs</span></p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Cari di master barang..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Visual & Nama Aset</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5 text-center">Rincian Stok</th>
                <th className="px-8 py-5">Sewa Per Hari</th>
                <th className="px-8 py-5 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => {
                const isCritical = item.availableQuantity > 0 && item.availableQuantity < 3;
                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img 
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=800'} 
                            className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm border border-white" 
                          />
                          {isCritical && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-800">{item.name}</div>
                          <div className="flex items-center mt-1.5 space-x-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                              item.status === ItemStatus.READY ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {item.status}
                            </span>
                            {isCritical && (
                              <span className="text-[8px] font-black text-red-500 uppercase tracking-wider animate-pulse">Stok Menipis!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{item.category}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-sm font-black text-slate-700">{item.availableQuantity} <span className="text-[10px] text-slate-400">/ {item.totalQuantity}</span></div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-blue-600">
                        {item.rentalPrice > 0 ? `Rp ${item.rentalPrice.toLocaleString()}` : 'Gratis / Internal'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-4">
                      <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest transition-colors">Edit</button>
                      <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-colors">Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-down border-4 border-white">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Formulir Produk Aset</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SIMPANSE Master Data</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unggah Visual Aset</label>
                <div className="relative group w-full h-48 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300">
                  {editingItem.imageUrl ? (
                    <img src={editingItem.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Gambar Aset</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Barang</label>
                <input
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  placeholder="Misal: Toyota Avanza Silver"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 appearance-none"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    <option>Elektronik</option>
                    <option>Kendaraan</option>
                    <option>Fasilitas</option>
                    <option>Alat Kantor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Sewa (Opsional)</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-blue-600"
                    value={editingItem.rentalPrice}
                    onChange={(e) => setEditingItem({...editingItem, rentalPrice: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest ml-1">Total Stok Gudang</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-white border border-blue-200 rounded-2xl outline-none font-black text-blue-900"
                    value={editingItem.totalQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditingItem({...editingItem, totalQuantity: val, availableQuantity: Math.min(editingItem.availableQuantity, val)});
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest ml-1">Stok Ready (Display)</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-white border border-blue-200 rounded-2xl outline-none font-black text-emerald-600"
                    value={editingItem.availableQuantity}
                    onChange={(e) => setEditingItem({...editingItem, availableQuantity: Math.min(parseInt(e.target.value) || 0, editingItem.totalQuantity)})}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
