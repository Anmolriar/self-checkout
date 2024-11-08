import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CircleDollarSign, Tag } from 'lucide-react';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  confidence: number;
  reason: string;
}

const ProductRecommendations = ({ onAddToCart }: { onAddToCart: (productId: string) => void }) => {
  const recommendations: RecommendedProduct[] = [
    {
      id: '123456',
      name: 'iPhone 15 Pro Max',
      price: 1299.99,
      image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037',
      confidence: 92,
      reason: 'Best-selling smartphone model'
    },
    {
      id: '234567',
      name: 'iPhone 15 Pro',
      price: 999.99,
      image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037',
      confidence: 85,
      reason: 'Popular among tech enthusiasts'
    },
    {
      id: '345678',
      name: 'iPhone 15',
      price: 799.99,
      image: 'https://shop.mobileklinik.ca/cdn/shop/files/iPhone15Pro-Black-500px_500x500.png?v=1707401037',
      confidence: 78,
      reason: 'Great value for features'
    }
  ];

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-semibold text-lg">AI Recommendations</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:border-purple-500/30 transition-colors"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddToCart(product.id)}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <CircleDollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-purple-500">{product.confidence}% match</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;