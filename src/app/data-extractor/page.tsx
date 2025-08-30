
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, X, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { extractDataFromDocument } from '@/app/document-processor/actions';
import { type ProcessedDocument } from '@/ai/flows/process-document-flow';
import { DataExtractorResults } from './data-extractor-results';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProcessedFile = {
    id: string;
    file: File;
    preview: string;
    isLoading: boolean;
    data: ProcessedDocument | null;
    error: string | null;
}

export default function DataExtractorPage() {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const processFile = useCallback(async (file: File) => {
    const fileId = `${file.name}-${file.lastModified}`;
    const reader = new FileReader();

    reader.onload = async (readEvent) => {
        const fileDataUri = readEvent.target?.result as string;
        if (!fileDataUri) {
            setProcessedFiles(prev => prev.map(f => f.id === fileId ? {...f, isLoading: false, error: 'Could not read file.'} : f));
            return;
        };

        const result = await extractDataFromDocument({ documentDataUri: fileDataUri });
        
        setProcessedFiles(prev => prev.map(f => {
            if(f.id === fileId) {
                return {
                    ...f,
                    isLoading: false,
                    data: result.success ? result.data : null,
                    error: result.success ? null : result.error || 'Failed to extract data.',
                }
            }
            return f;
        }));
    };
    
    reader.onerror = () => {
         setProcessedFiles(prev => prev.map(f => f.id === fileId ? {...f, isLoading: false, error: 'Error reading file.'} : f));
    }

    reader.readAsDataURL(file);

  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ProcessedFile[] = acceptedFiles.map(file => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        preview: URL.createObjectURL(file),
        isLoading: true,
        data: null,
        error: null,
    }));
    
    setProcessedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => processFile(file.file));

  }, [processFile]);


  const handleReset = () => {
      processedFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setProcessedFiles([]);
  }

  const handleExportAll = () => {
    const wb = XLSX.utils.book_new();
    processedFiles.forEach((file, index) => {
        if(file.data) {
            const mainData = [{
                'Document Type': file.data.documentType,
                'Vendor Name': file.data.vendorName,
                'Customer Name': file.data.customerName,
                'Date': file.data.date,
                'Due Date': file.data.dueDate,
                'VAT/TRN No': file.data.vatRegNo,
                'Subtotal': file.data.subTotal,
                'Tax': file.data.tax,
                'Total': file.data.total,
            }];
             const itemsData = file.data.items.map(item => ({
                'Description': item.description,
                'Quantity': item.quantity,
                'Unit Price': item.unitPrice,
                'Line Total': item.total,
            }));

            const wsMain = XLSX.utils.json_to_sheet(mainData);
            const wsItems = XLSX.utils.json_to_sheet(itemsData);
            
            // Sanitize sheet name
            const sheetName = file.file.name.replace(/[\/\\?*\[\]]/g, '').substring(0, 25);
            
            XLSX.utils.book_append_sheet(wb, wsMain, `${sheetName}-Sum`);
            XLSX.utils.book_append_sheet(wb, wsItems, `${sheetName}-Items`);
        }
    });

    XLSX.writeFile(wb, 'bulk-extracted-data.xlsx');
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Bulk Data Extractor</h1>
        <p className="text-muted-foreground">Upload multiple documents to extract data without creating financial records.</p>
      </div>
      
       <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors mb-8 ${
        isDragActive ? 'border-primary' : 'border-border'
        }`}
    >
        <input {...getInputProps()} />
        <FileUp className="w-12 h-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
        {isDragActive
            ? 'Drop the files here ...'
            : "Drag 'n' drop documents here, or click to select files"}
        </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or PDF</p>
    </div>

      {processedFiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Processing Results</h2>
                <div className="flex gap-2">
                    <Button onClick={handleExportAll}>
                        <FileSpreadsheet className="mr-2 h-4 w-4"/>
                        Export All to Excel
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                        <X className="mr-2 h-4 w-4"/> Clear All
                    </Button>
                </div>
            </div>
             <ScrollArea className="h-[70vh] p-4 border rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {processedFiles.map(pf => (
                        <div key={pf.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                            <div className="w-full h-full">
                                {pf.file.type.startsWith('image/') ? (
                                    <img src={pf.preview} alt={pf.file.name} className="rounded-lg object-contain w-full h-full max-h-[60vh]" />
                                ) : (
                                    <iframe src={pf.preview} className="w-full h-[60vh] rounded-lg border"/>
                                )}
                                <p className="text-xs text-center mt-1 text-muted-foreground truncate">{pf.file.name}</p>
                            </div>
                            <div className="space-y-4">
                                {pf.isLoading && (
                                    <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-lg p-4">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                        <p className="mt-4 text-muted-foreground">Analyzing document...</p>
                                    </div>
                                )}
                                {pf.error && (
                                    <div className="text-red-500 bg-destructive/10 p-4 rounded-lg">
                                        <h3 className="font-bold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Analysis Failed</h3>
                                        <p className="text-sm mt-2">{pf.error}</p>
                                    </div>
                                )}
                                {pf.data && (
                                    <DataExtractorResults processedData={pf.data} fileName={pf.file.name} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </div>
      )}
    </div>
  );
}
