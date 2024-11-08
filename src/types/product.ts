// src/types/product.ts
export interface IProduct {
    _id?: string;
    name: string;
    sku: string;
    barcode?: string;
    price: number;
    description?: string;
    category?: string;
    imageUrl?: string;
    inStock: number;
    metadata?: Record<string, any>;
    importSource?: 'manual' | 'csv' | 'excel' | 'api';
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ImportResult {
    success: boolean;
    imported: number;
    failed: number;
    errors?: Array<{
      row: number;
      message: string;
    }>;
  }