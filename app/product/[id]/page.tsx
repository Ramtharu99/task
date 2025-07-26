'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Product } from '@/types';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product. Please try again.');
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.title} added to cart!`);
    }
  };

  if (!product) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover mb-4" />
          <p>{product.description}</p>
          <p className="text-xl font-semibold mt-2">${product.price}</p>
          <Button onClick={handleAddToCart} className="mt-4">
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}