
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type ActionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: (comment: string) => void;
  actionType: 'APPROVE' | 'REJECT' | 'ADD_COMMENT';
  isProcessing: boolean;
}

export function ActionDialog({ isOpen, setIsOpen, onConfirm, actionType, isProcessing }: ActionDialogProps) {
    const [comment, setComment] = useState('');

    const titleMap = {
        APPROVE: 'Approve Document',
        REJECT: 'Reject Document',
        ADD_COMMENT: 'Add a Comment'
    }

    const descriptionMap = {
        APPROVE: 'Please provide an optional comment for approving this document.',
        REJECT: 'Please provide the reason for rejecting this document.',
        ADD_COMMENT: 'Please enter your comment below. It will be added to the document history.'
    }

    const handleConfirm = () => {
        onConfirm(comment);
        setComment('');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{titleMap[actionType]}</DialogTitle>
                     <DialogDescription>{descriptionMap[actionType]}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea 
                        id="comment" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        placeholder="Add your comment here..."
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isProcessing}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {actionType === 'REJECT' ? 'Confirm Rejection' : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
