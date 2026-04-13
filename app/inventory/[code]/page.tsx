import { InventoryItem } from '@/types/inventory';
import InventoryItemClient from './InventoryItemClient';
import fs from 'fs';
import path from 'path';

// Generate static params for all inventory items
export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return data.items.map((item: InventoryItem) => ({
      code: item.code,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Load item data at build time
async function getItem(code: string): Promise<InventoryItem | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'inventory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.items.find((item: InventoryItem) => item.code === code) || null;
  } catch (error) {
    console.error('Error loading item:', error);
    return null;
  }
}

export default async function InventoryItemPage({
  params,
}: {
  params: { code: string };
}) {
  const item = await getItem(params.code);

  return <InventoryItemClient item={item} code={params.code} />;
}
