'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import type { ActivityLog } from '@/types';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export default function ActivityLogTable({ logs }: ActivityLogTableProps) {
    if (logs.length === 0) {
        return <p className="text-center text-sm text-muted-foreground p-4">No suspicious activity recorded.</p>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Link ID</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.activity}</TableCell>
                        <TableCell className="font-mono text-xs">{log.linkId.substring(0, 8)}...</TableCell>
                        <TableCell className="text-right">{format(log.timestamp, 'PPp')}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
