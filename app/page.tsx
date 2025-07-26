'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

// export const metadata = {
//   title: 'Mini E-Commerce App',
//   description: 'A mini e-commerce app with customer storefront and admin panel',
// };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover mb-2" />
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-semibold mt-2">${product.price}</p>
              <Button onClick={() => handleAddToCart(product)} className="mt-2">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}