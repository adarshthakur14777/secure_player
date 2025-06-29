'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/store';
import { UploadCloud } from 'lucide-react';

export default function AudioUpload() {
  const { toast } = useToast();
  const [trackName, setTrackName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !trackName) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a track name and select a file.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message);
      }

      const newBlob = await response.json();

      store.addAudioFile(trackName, file.name, newBlob.url);
      
      toast({
        title: 'Upload Successful',
        description: `"${trackName}" has been added to your library.`,
      });
      
      setTrackName('');
      setFile(null);
      const fileInput = document.getElementById('audio-file') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Audio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="track-name">Track Name</Label>
            <Input
              id="track-name"
              placeholder="e.g., Secret Demo, Project Alpha Mix"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audio-file">Audio File (MP3, WAV, M4A)</Label>
            <Input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} disabled={isUploading} />
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isUploading}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
