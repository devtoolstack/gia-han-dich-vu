export type BillingCycle = 'monthly' | 'quarterly' | 'yearly' | 'custom';

export type Currency = 'VND' | 'USD';

export interface Subscription {
  id: string;
  name: string;
  price: number; // Raw entered price
  currency: Currency; // VND or USD
  billingCycle: BillingCycle;
  customMonths?: number;
  lastRenewalDate: string; // YYYY-MM-DD (Ngày đăng ký / gia hạn gần nhất)
  renewalDate: string; // YYYY-MM-DD (Ngày cần gia hạn)
  notes?: string;
}

export type FilterStatus = 'all' | 'urgent';
export type SortOption = 'nearest' | 'farthest' | 'price-desc' | 'price-asc' | 'name';
