
import { Item, ItemStatus } from './types';

export const INITIAL_ITEMS: Item[] = [
  { 
    id: '1', 
    name: 'Laptop Dell Latitude', 
    category: 'Elektronik', 
    rentalPrice: 0, 
    status: ItemStatus.READY, 
    totalQuantity: 10, 
    availableQuantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '2', 
    name: 'Proyektor Epson EB-X400', 
    category: 'Elektronik', 
    rentalPrice: 0, 
    status: ItemStatus.READY, 
    totalQuantity: 5, 
    availableQuantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '3', 
    name: 'Mobil Toyota Avanza', 
    category: 'Kendaraan', 
    rentalPrice: 50000, 
    status: ItemStatus.READY, 
    totalQuantity: 2, 
    availableQuantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '4', 
    name: 'Ruang Meeting A', 
    category: 'Fasilitas', 
    rentalPrice: 0, 
    status: ItemStatus.BORROWED, 
    totalQuantity: 1, 
    availableQuantity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '5', 
    name: 'Kamera Sony Alpha 7', 
    category: 'Elektronik', 
    rentalPrice: 75000, 
    status: ItemStatus.READY, 
    totalQuantity: 3, 
    availableQuantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
  },
];
