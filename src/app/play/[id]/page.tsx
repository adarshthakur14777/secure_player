'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import type { AudioFile, OneTimeLink } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function PlayPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState<{ link: OneTimeLink; file: AudioFile } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoggedActivity = useRef(false);

  useEffect(() => {
    const linkData = store.getLink(id);
    if (linkData && !linkData.link.used) {
      setData(linkData);
      store.useLink(id);
    } else {
      setError(true);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    if (!isLoading && error) {
      router.replace('/play/expired');
    }
  }, [isLoading, error, router]);

  if (isLoading || error) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data && !hasLoggedActivity.current) {
      store.logActivity(data.link.id, 'Context menu opened');
      hasLoggedActivity.current = true;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      {data && (
        <Card className="w-full max-w-lg" onContextMenu={handleContextMenu}>
          <CardHeader>
            <CardTitle>{data.file.name}</CardTitle>
            <CardDescription>This is a single-use link. The audio can only be played once.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <audio controls controlsList="nodownload" className="w-full">
              <source src={data.file.fileUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    This content is protected. Recording or redistributing this audio is strictly prohibited and may be monitored.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
