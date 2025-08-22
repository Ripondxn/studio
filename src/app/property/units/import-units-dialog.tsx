

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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { type Unit } from './schema';
import { importUnits } from './actions';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImportUnitsDialogProps {
  propertyCode: string;
  onImportSuccess: () => void;
}

const requiredHeaders = ['unitCode', 'floor', 'unitType', 'annualRent', 'unitStatus'];

export function ImportUnitsDialog({ propertyCode, onImportSuccess }: ImportUnitsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<Omit<Unit, 'id' | 'occupancyStatus' | 'propertyCode'>[]>([]);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const router = useRouter();
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
        
        // Validate headers
        if (json.length > 0) {
            const headers = Object.keys(json[0]);
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
            if (missingHeaders.length > 0) {
                toast({ variant: 'destructive', title: 'Invalid File Format', description: `Missing required columns: ${missingHeaders.join(', ')}`});
                return;
            }
        }

        setParsedData(json);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error Parsing File', description: 'Please ensure the file is a valid Excel spreadsheet.'});
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
        toast({ variant: 'destructive', title: 'No Data', description: 'No data to import.'});
        return;
    }
    
    setIsSaving(true);

    const unitsToImport = parsedData.map(unit => ({...unit, propertyCode}));
    
    const result = await importUnits(unitsToImport);

    if (result.success) {
      toast({
        title: 'Import Successful',
        description: `${result.added} units added, ${result.updated} units updated.`,
      });
      onImportSuccess();
      setIsOpen(false);
      setParsedData([]);
      setFileName('');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error During Import',
        description: result.error,
      });
    }
    setIsSaving(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
        setParsedData([]);
        setFileName('');
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileUp className="mr-2 h-4 w-4" /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Units from Excel</DialogTitle>
            <DialogDescription>
              Select an Excel file to bulk-add or update units for property {propertyCode}.
              The file must contain columns: {requiredHeaders.join(', ')}.
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
                            {requiredHeaders.map(h => <TableHead key={h}>{h}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedData.slice(0, 20).map((row: any, index) => (
                            <TableRow key={index}>
                                {requiredHeaders.map(h => <TableCell key={h}>{String(row[h] ?? '')}</TableCell>)}
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
              Import Data
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

