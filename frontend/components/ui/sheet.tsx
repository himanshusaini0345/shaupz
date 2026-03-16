'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Sheet({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/20">{children}</div>;
}

export function SheetContent({ className, children }: { className?: string; children: ReactNode }) {
  return <aside className={cn('ml-auto h-full w-full max-w-md bg-white p-6 shadow-xl', className)}>{children}</aside>;
}
