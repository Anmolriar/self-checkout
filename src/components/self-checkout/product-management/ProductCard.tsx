// src/components/self-checkout/product-management/ProductCard.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { IProduct } from '@/models/Product';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{product.name}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
          <p className="text-sm">In Stock: {product.inStock}</p>
        </div>
      </CardContent>
    </Card>
  );
};