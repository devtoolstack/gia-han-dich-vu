import { Subscription, Currency, BillingCycle } from '../types';

export const DEFAULT_USD_TO_VND = 25400;

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Convert any subscription price to VND
export function getCostInVND(price: number, currency: Currency, rate: number = DEFAULT_USD_TO_VND): number {
  if (currency === 'USD') {
    return price * rate;
  }
  return price;
}

// Calculate monthly equivalent cost in VND
export function getMonthlyCostInVND(sub: Subscription, rate: number = DEFAULT_USD_TO_VND): number {
  const priceInVND = getCostInVND(sub.price, sub.currency, rate);
  switch (sub.billingCycle) {
    case 'monthly':
      return priceInVND;
    case 'quarterly':
      return priceInVND / 3;
    case 'yearly':
      return priceInVND / 12;
    case 'custom':
      const months = sub.customMonths || 1;
      return priceInVND / months;
    default:
      return priceInVND;
  }
}

// Calculate yearly equivalent cost in VND
export function getYearlyCostInVND(sub: Subscription, rate: number = DEFAULT_USD_TO_VND): number {
  return getMonthlyCostInVND(sub, rate) * 12;
}

// Calculate days left from today to renewalDate
export function getDaysLeft(renewalDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDateStr);
  renewal.setHours(0, 0, 0, 0);
  const diffTime = renewal.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Format date nicely for VN (DD/MM/YYYY)
export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Convert ISO (YYYY-MM-DD) to Display DD/MM/YYYY
export function isoToDisplayDate(isoStr: string): string {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Convert Display DD/MM/YYYY (or DD-MM-YYYY) to ISO (YYYY-MM-DD)
export function displayToIsoDate(displayStr: string): string {
  if (!displayStr) return new Date().toISOString().split('T')[0];
  const cleaned = displayStr.trim().replace(/-/g, '/');
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    if (year.length === 4 && !isNaN(Number(day)) && !isNaN(Number(month)) && !isNaN(Number(year))) {
      return `${year}-${month}-${day}`;
    }
  }
  return displayStr; // Fallback
}

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];
