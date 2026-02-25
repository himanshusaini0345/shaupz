'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CheckoutForm } from './checkout-form';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([]);

  async function removeItem(productId: string) {
    await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/cart/remove', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId })
    });
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cart ({items.length})
      </Button>
      <Sheet open={open}>
        <SheetContent>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
          <ul className="space-y-2">
            {items.length === 0 && <li className="text-sm text-slate-500">No items yet.</li>}
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between rounded border p-2">
                <span>
                  {item.productId} x {item.quantity}
                </span>
                <Button size="sm" variant="outline" onClick={() => removeItem(item.productId)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <CheckoutForm />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
