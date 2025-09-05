
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getEmployeeHistory } from '@/app/human-resource/employees/actions';
import { useReactToPrint } from 'react-to-print';

interface EmployeeHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  employeeId: string | null;
}

export default function EmployeeHistoryDialog({ isOpen, onOpenChange, employeeId }: EmployeeHistoryDialogProps) {
  const [history, setHistory] = useState<any[]>([]);
  const componentRef = useRef(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      const fetchHistory = async () => {
        const employeeHistory = await getEmployeeHistory(employeeId);
        setHistory(employeeHistory);
      };
      fetchHistory();
    }
  }, [isOpen, employeeId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Employee History</DialogTitle>
          <DialogDescription>View the change history for the selected employee.</DialogDescription>
        </DialogHeader>
        <div ref={componentRef} className="p-4">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Changed At</TableHead>
                    <TableHead>Changes</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {history.map((entry, index) => (
                    <TableRow key={index}>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{entry.changedBy}</TableCell>
                    <TableCell>{new Date(entry.changedAt).toLocaleString()}</TableCell>
                    <TableCell>
                        <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(entry.changes, null, 2)}
                        </pre>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
        <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handlePrint}>Print</Button>
            <Button type="button" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
