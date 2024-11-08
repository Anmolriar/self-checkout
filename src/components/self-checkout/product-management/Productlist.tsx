// src/components/self-checkout/product-management/ProductList.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, AlertCircle } from 'lucide-react';
import { ProductService } from '@/services/productService';
import { IProduct } from '@/models/Product';
import { ProductCard } from './ProductCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ProductList: React.FC = () => {
  // State management
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productService = new ProductService();

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Functions
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const products = await productService.getProducts();
      setProducts(products);
    } catch (error) {
      setError('Failed to load products. Please try again later.');
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsImportDialogOpen(true);
    
    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      setIsImportDialogOpen(false);
      await productService.importProducts(selectedFile);
      await loadProducts();
    } catch (error) {
      setError('Import failed. Please check your file and try again.');
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Product Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Search Input */}
          <div className="w-full sm:w-96">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleFileUploadClick}
              disabled={isImporting}
              className="whitespace-nowrap"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import Products'}
            </Button>
            <Button className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "No products match your search criteria"
                    : "Get started by importing products or adding them manually"}
                </p>
                {!searchTerm && (
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleFileUploadClick}>
                      Import Products
                    </Button>
                    <Button>
                      Add Product
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Import Confirmation Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to import products from {selectedFile?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleImportConfirm} disabled={isImporting}>
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;