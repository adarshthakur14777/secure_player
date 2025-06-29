'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // This check runs only on the client side
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuth(authStatus);
    if (!authStatus) {
      router.replace('/admin/login');
    }
  }, [router]);

  if (isAuth === null || !isAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-4">
        <Skeleton className="h-12 w-full max-w-lg" />
        <Skeleton className="h-48 w-full max-w-lg" />
        <Skeleton className="h-64 w-full max-w-lg" />
      </div>
    );
  }

  return <>{children}</>;
}
