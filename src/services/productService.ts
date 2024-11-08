// src/services/productService.ts
import { Storage } from '@google-cloud/storage';
import { parse as parseCsv } from 'papaparse';
import * as XLSX from 'xlsx';
import dbConnect from '@/lib/db';
import { Product, IProduct } from '@/models/Product';

export class ProductService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH
    });
  }

  async createProduct(productData: Partial<IProduct>) {
    await dbConnect();
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async getProducts() {
    await dbConnect();
    try {
      return await Product.find({});
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async importProducts(file: File) {
    await dbConnect();
    const fileType = file.name.split('.').pop()?.toLowerCase();
    let products = [];

    try {
      if (fileType === 'csv') {
        products = await this.parseCSV(file);
      } else if (['xlsx', 'xls'].includes(fileType)) {
        products = await this.parseExcel(file);
      } else {
        throw new Error('Unsupported file format');
      }

      const validatedProducts = await this.validateProducts(products);
      
      return await Product.insertMany(validatedProducts, {
        ordered: false
      });
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  private async validateProducts(products: any[]) {
    return products.map(product => ({
      ...product,
      price: Number(product.price),
      inStock: Number(product.inStock || 0),
    }));
  }

  private async parseCSV(file: File) {
    // Implement CSV parsing
    return [];
  }

  private async parseExcel(file: File) {
    // Implement Excel parsing
    return [];
  }
}