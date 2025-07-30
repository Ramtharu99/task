'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, addOrder } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', address: '' },
  });

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const order = {
        userId: 1,
        products: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity || 1,
        })),
      };
      const response = await api.post('/carts/add', order);
      addOrder({
        id: response.data.id || Date.now(),
        userId: 1,
        products: order.products,
        total,
        name: values.name,
        email: values.email,
        address: values.address,
      });
      toast.success('Order placed successfully!');
      router.push('/success');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.', {
        style: { background: '#ef4444', color: '#fff' },
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <>
          <p>Your cart is empty</p>
          <Button variant="default" onClick={() => router.push("/")}>Shopping</Button>
        </>
      ) : (
        <>
          <div className="grid gap-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p>${item.price} x {item.quantity || 1}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) === 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity || 1}</span>
                    <Button
                      variant="outline"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      +
                    </Button>
                    <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</p>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="mt-1"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    id="address"
                    {...register('address')}
                    className="mt-1"
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Checkout
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}