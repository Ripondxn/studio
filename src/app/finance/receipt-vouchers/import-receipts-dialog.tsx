
'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImportReceiptsDialogProps {
  onDataImport: (data: any[]) => void;
}

const requiredHeaders = ['receiptno', 'partyname', 'amount'];
const displayHeaders = ['receiptNo', 'date', 'partyType', 'partyName', 'amount', 'paymentMethod', 'collectedBy', 'notes'];

// Helper function to convert any string to camelCase
const toCamelCase = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, (match) => match.toLowerCase());
};

export function ImportReceiptsDialog({ onDataImport }: ImportReceiptsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        // Normalize keys of each object to be camelCase and handle case-insensitivity
        const normalizedJson = json.map(row => {
            const normalizedRow: {[key: string]: any} = {};
            for (const key in row) {
                normalizedRow[toCamelCase(key)] = row[key];
            }
            return normalizedRow;
        });

        if (normalizedJson.length > 0) {
            const headers = Object.keys(normalizedJson[0]).map(h => h.toLowerCase());
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
            if (missingHeaders.length > 0) {
                toast({ variant: 'destructive', title: 'Invalid File Format', description: `Missing required columns: ${missingHeaders.join(', ')}`});
                return;
            }
        }

        setParsedData(normalizedJson);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error Parsing File', description: 'Please ensure the file is a valid Excel spreadsheet.'});
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    onDataImport(parsedData);
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        setParsedData([]);
        setFileName('');
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileUp className="mr-2 h-4 w-4" /> Import from Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Receipts from Excel</DialogTitle>
            <DialogDescription>
              Select an Excel file to bulk-populate receipt vouchers.
              Required columns: {requiredHeaders.join(', ')}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
                <Input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".xlsx, .xls, .csv" />
                {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
              </div>

              <p className="text-sm text-muted-foreground">
                Preview of data to be imported ({parsedData.length} rows):
              </p>
              
              <ScrollArea className="h-72 rounded-md border">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            {displayHeaders.map(h => <TableHead key={h}>{h}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedData.slice(0, 20).map((row: any, index) => (
                            <TableRow key={index}>
                                {displayHeaders.map(h => <TableCell key={h}>{String(row[h] ?? '')}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {parsedData.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10">
                        <TableIcon className="h-10 w-10 mb-4" />
                        <p>No data to preview.</p>
                        <p className="text-xs">Select a file to see a preview of the data.</p>
                    </div>
                )}
              </ScrollArea>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleImport} disabled={isSaving || parsedData.length === 0}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load Data to Form
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
