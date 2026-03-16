'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';

export function CheckoutForm() {
  const [status, setStatus] = useState('');

  async function checkoutWithRetry() {
    const idempotencyKey = uuidv4();
    const endpoint = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/checkout';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
            'idempotency-key': idempotencyKey
          }
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || 'Checkout failed');
        setStatus(`Order created: ${body.orderId}`);
        return;
      } catch {
        if (attempt === 3) {
          setStatus('Checkout failed after retries.');
          return;
        }
      }
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={checkoutWithRetry}>Checkout</Button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}
