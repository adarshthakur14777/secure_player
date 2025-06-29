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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { store } from '@/lib/store';
import { format } from 'date-fns';
import { Link2, Trash2, ListMusic, Activity } from 'lucide-react';
import type { AudioFile } from '@/types';
import GenerateLinksDialog from './generate-links-dialog';
import LinksTable from './links-table';
import ActivityLogTable from './activity-log-table';

interface AudioListProps {
  audioFiles: AudioFile[];
}

export default function AudioList({ audioFiles }: AudioListProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

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
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="links"><ListMusic className="w-4 h-4 mr-2"/>Links ({file.links.length})</TabsTrigger>
                        <TabsTrigger value="logs"><Activity className="w-4 h-4 mr-2"/>Activity ({file.activityLogs.length})</TabsTrigger>
                    </TabsList>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedFileId(file.id);
                        setDialogOpen(true);
                      }}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Generate Links
                    </Button>
                </div>
                <TabsContent value="links">
                  <LinksTable links={file.links} audioFileId={file.id} onDeleteLink={(linkId) => handleDeleteLink(file.id, linkId)} />
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
