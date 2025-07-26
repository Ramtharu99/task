'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { Order } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { orders } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      toast.error('Please log in to access the admin dashboard.');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No customer orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>
                      {order.products.map((p) => (
                        <div key={p.productId}>
                          ID: {p.productId}, Qty: {p.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}