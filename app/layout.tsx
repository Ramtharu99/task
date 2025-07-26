'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = useCartStore((state) => state.cart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              E-Commerce
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href={isAuthenticated ? '/admin/dashboard' : '/admin/login'}>
                <Button variant="default">Admin</Button>
              </Link>
            </div>
          </div>
        </header>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}