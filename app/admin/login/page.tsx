'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.email === 'admin@99.com' && values.password === 'admin123') {
      setAuth(true);
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      form.setError('email', { message: 'Invalid credentials' });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
      <section className='mt-4 text-sm text-gray-600'>
        <p>Email:admin@99.com </p>
        <p>Password: admin123</p>
      </section>
    </div>
  );
}