
export enum ItemStatus {
  READY = 'Ready',
  BORROWED = 'Borrowed',
  OUT_OF_STOCK = 'Out of Stock'
}

export type LoanStatus = 'Pending' | 'Verified' | 'Approved' | 'Rejected' | 'Returned' | 'Queued' | 'ReviewRequired';

export type UserRole = 'Borrower' | 'Admin' | 'Verificator' | 'SuperAdmin';

export type BorrowerType = 'Instansi' | 'Pribadi';

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce' | 'rotate' | 'slideUp';

export interface SliderItem {
  id: string;
  url: string;
  title: string;
  transition: TransitionType;
}

export interface SystemConfig {
  appName: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  socialFB: string;
  socialIG: string;
  socialYT: string;
  secondaryLogoUrl: string;
  sliders: SliderItem[];
}

export interface Item {
  id: string;
  name: string;
  category: string;
  rentalPrice: number;
  status: ItemStatus;
  totalQuantity: number;
  availableQuantity: number;
  imageUrl?: string;
}

export interface Loan {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  borrowerName: string;
  borrowerNIK: string;
  borrowerAddress: string;
  idCardPhoto?: string;
  borrowerType: BorrowerType;
  instanceName?: string;
  instanceAddress?: string;
  instancePhone?: string;
  instanceEmail?: string;
  borrowerEmail: string;
  borrowerPhone: string;
  purpose: string;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  signature: string;
  createdAt: string;
  rejectionReason?: string;
  notified?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  email: string;
  password?: string;
}

export type ViewType = 'catalog' | 'my-loans' | 'admin-items' | 'verificator-approval' | 'super-admin-users' | 'admin-tracking' | 'super-admin-settings';
