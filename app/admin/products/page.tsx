'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function AdminProducts() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?limit=20');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}