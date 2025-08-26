
'use client';

import { type Asset, type AssetHistory } from './schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, CircleDot, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface AssetHistoryDialogProps {
  asset: Asset;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AssetHistoryDialog({ asset, isOpen, setIsOpen }: AssetHistoryDialogProps) {
  const history = asset.history || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>History for: {asset.assetName}</DialogTitle>
          <DialogDescription>
            A complete audit trail of all changes and assignments for this asset.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
            <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                
                {history.slice().reverse().map((entry, index) => (
                    <div key={index} className="relative mb-8 pl-8">
                        <div className="absolute left-0 top-1.5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-background">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                                <CheckCircle className="h-3 w-3 text-primary-foreground" />
                            </span>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <p className="font-semibold">{entry.status}</p>
                            <p className="text-sm text-muted-foreground">
                                {format(parseISO(entry.date), "PPP 'at' p")}
                            </p>
                            {entry.assignedTo && (
                                <p className="mt-2 text-sm">
                                    <span className="font-medium">Assigned to:</span> {entry.assignedTo}
                                </p>
                            )}
                            {entry.notes && (
                                <p className="mt-2 text-sm text-muted-foreground italic">
                                    "{entry.notes}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
