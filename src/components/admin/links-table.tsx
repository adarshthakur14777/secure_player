'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { OneTimeLink } from '@/types';
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

interface LinksTableProps {
  audioFileId: string;
  links: OneTimeLink[];
  onDeleteLink: (linkId: string) => void;
}

export default function LinksTable({ links, audioFileId, onDeleteLink }: LinksTableProps) {
  const { toast } = useToast();

  const copyToClipboard = (linkId: string) => {
    const url = `${window.location.origin}/play/${linkId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'The shareable link has been copied to your clipboard.',
    });
  };

  if (links.length === 0) {
    return <p className="text-center text-sm text-muted-foreground p-4">No links generated for this track yet.</p>;
  }

  return (
    <div className="rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Link URL</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="whitespace-nowrap">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {links.map((link) => (
            <TableRow key={link.id}>
                <TableCell className="font-mono text-xs truncate max-w-xs">
                {`/play/${link.id}`}
                </TableCell>
                <TableCell className="text-center">
                <Badge variant={link.used ? 'secondary' : 'default'} className={link.used ? '' : 'bg-green-600 hover:bg-green-700'}>
                    {link.used ? 'Expired' : 'Active'}
                </Badge>
                </TableCell>
                <TableCell>{format(link.createdAt, 'PPp')}</TableCell>
                <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(link.id)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete link</span>
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This will permanently delete the link. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteLink(link.id)}>
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
