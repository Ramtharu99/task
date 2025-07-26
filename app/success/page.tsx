import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Success() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Placed Successfully</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for your order! You will receive a confirmation soon.</p>
          <Link href="/">
            <Button className="mt-4">Back to Store</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}