'use client';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/store';
import { format } from 'date-fns';
import { Link2, Trash2, ListMusic, Activity, FileText, Bot, Copy as CopyIcon } from 'lucide-react';
import type { AudioFile } from '@/types';
import GenerateLinksDialog from './generate-links-dialog';
import LinksTable from './links-table';
import ActivityLogTable from './activity-log-table';
import { transcribeAudio } from '@/ai/flows/transcribe-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioListProps {
  audioFiles: AudioFile[];
}

export default function AudioList({ audioFiles }: AudioListProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [retryingTranscription, setRetryingTranscription] = useState<string | null>(null);

  const handleDeleteFile = (id: string) => {
    store.deleteAudioFile(id);
    toast({
      title: 'File Deleted',
      description: 'The audio file and all its links have been removed.',
    });
  };

  const handleGenerateLinks = (quantity: number) => {
    if (selectedFileId) {
      store.generateLinks(selectedFileId, quantity);
      toast({
        title: 'Links Generated',
        description: `${quantity} new link(s) have been created.`,
      });
    }
  };
  
  const handleDeleteLink = (audioFileId: string, linkId: string) => {
    store.deleteLink(audioFileId, linkId);
    toast({
      title: 'Link Deleted',
      description: 'The link has been removed.',
    });
  };

  const handleGenerateTranscript = async (file: AudioFile) => {
    setRetryingTranscription(file.id);
    store.setTranscribing(file.id, true);
    try {
      const { transcript } = await transcribeAudio({ audioUrl: file.fileUrl });
      store.addTranscript(file.id, transcript);
      toast({
        title: 'Transcription Complete',
        description: `"${file.name}" has been transcribed.`,
      });
    } catch (error) {
      console.error('Transcription retry error:', error);
      toast({
        variant: 'destructive',
        title: 'Transcription Failed',
        description: 'Could not generate a transcript for this file.',
      });
      store.setTranscribing(file.id, false);
    } finally {
      setRetryingTranscription(null);
    }
  };

  const copyToClipboard = (text: string, entity: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${entity} Copied!`,
      description: `The ${entity.toLowerCase()} has been copied to your clipboard.`,
    });
  };

  if (audioFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <ListMusic className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">Your library is empty</h3>
        <p className="mt-1 text-sm text-muted-foreground">Upload your first audio file to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {audioFiles.map((file) => (
          <AccordionItem value={file.id} key={file.id}>
            <div className="flex items-center">
              <AccordionTrigger className="flex-1 pr-2">
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Created on {format(file.createdAt, 'PPP')}
                  </p>
                </div>
              </AccordionTrigger>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{file.name}" and all of its associated links. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteFile(file.id)} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <AccordionContent className="bg-muted/30 p-4 rounded-md">
              <Tabs defaultValue="links" className="w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <TabsList className="self-start">
                        <TabsTrigger value="links"><ListMusic className="w-4 h-4 mr-2"/>Links ({file.links.length})</TabsTrigger>
                        <TabsTrigger value="transcript"><FileText className="w-4 h-4 mr-2"/>Transcript</TabsTrigger>
                        <TabsTrigger value="logs"><Activity className="w-4 h-4 mr-2"/>Activity ({file.activityLogs.length})</TabsTrigger>
                    </TabsList>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedFileId(file.id);
                        setDialogOpen(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Generate Links
                    </Button>
                </div>
                <TabsContent value="links">
                  <LinksTable links={file.links} audioFileId={file.id} onDeleteLink={(linkId) => handleDeleteLink(file.id, linkId)} />
                </TabsContent>
                <TabsContent value="transcript">
                  {file.isTranscribing || retryingTranscription === file.id ? (
                    <div className="space-y-2 p-4">
                      <p className='text-sm font-medium text-muted-foreground mb-2'>Transcription in progress...</p>
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : file.transcript ? (
                     <div className="relative">
                       <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-8 w-8 z-10"
                          onClick={() => copyToClipboard(file.transcript!, 'Transcript')}
                       >
                         <CopyIcon className="h-4 w-4" />
                       </Button>
                       <ScrollArea className="h-48 rounded-md border p-4 bg-background">
                         <pre className="text-sm whitespace-pre-wrap font-sans">{file.transcript}</pre>
                       </ScrollArea>
                     </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">No transcript available for this audio file.</p>
                      <Button onClick={() => handleGenerateTranscript(file)} disabled={!!retryingTranscription}>
                        <Bot className="mr-2 h-4 w-4" />
                        {retryingTranscription === file.id ? 'Generating...' : 'Generate Transcript'}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="logs">
                  <ActivityLogTable logs={file.activityLogs} />
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <GenerateLinksDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGenerate={handleGenerateLinks}
      />
    </>
  );
}
