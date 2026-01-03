import { InventoryData, InventoryItem } from '@/types/inventory';

// For static export, data will be loaded client-side via fetch
// This file provides type definitions and utility functions

export function getInventoryItemFromData(data: InventoryData, code: string): InventoryItem | undefined {
  return data.items.find(item => item.code === code);
}

export function getAllInventoryItemsFromData(data: InventoryData): InventoryItem[] {
  return data.items;
}

export function getCategoriesFromData(data: InventoryData): { id: number; name: string }[] {
  return data.categories;
}

export function getManufacturersFromData(data: InventoryData): string[] {
  return data.manufacturers;
}

