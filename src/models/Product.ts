// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
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

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  sku: { type: String, unique: true },
  barcode: { type: String, sparse: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  imageUrl: String,
  inStock: { type: Number, default: 0 },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  importSource: {
    type: String,
    enum: ['manual', 'csv', 'excel', 'api'],
  }
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);