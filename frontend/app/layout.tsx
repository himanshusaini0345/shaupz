import './globals.css';
import type { Metadata } from 'next';
import { CartDrawer } from '@/components/cart/cart-drawer';

export const metadata: Metadata = {
  title: 'Ecom Demo'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <h1 className="text-xl font-semibold">Ecom</h1>
            <CartDrawer />
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
