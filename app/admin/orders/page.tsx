'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';

interface Order {
  id: number;
  userId: number;
  products: { productId: number; quantity: number }[];
  total: number;
}

export default function AdminOrders() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/carts');
        setOrders(response.data.carts);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>
                {order.products.map((p) => (
                  <div key={p.productId}>
                    Product ID: {p.productId}, Qty: {p.quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>${order.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}