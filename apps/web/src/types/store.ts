export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface StoreSettings {
  id: string;
  storeId: string;
  currency: string;
  taxRate: number;
  timezone: string;
  receiptTemplate: string;
  printerSettings: any;
}