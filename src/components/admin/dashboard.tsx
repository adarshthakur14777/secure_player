'use client';
import { useState, useEffect } from 'react';
import AudioUpload from './audio-upload';
import AudioList from './audio-list';
import { store } from '@/lib/store';
import type { AudioFile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function AdminDashboard() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(store.getAudioFiles());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setAudioFiles(store.getAudioFiles());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-6">
      <div className="space-y-8">
        <AudioUpload />
        <Card>
          <CardHeader>
            <CardTitle>Audio Library</CardTitle>
          </CardHeader>
          <CardContent>
            <AudioList audioFiles={audioFiles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
