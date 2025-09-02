
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, CheckCircle, AlertCircle, UploadCloud, Rocket } from 'lucide-react';
import { processDocument, type ProcessedDocument } from '@/ai/flows/process-document-flow';
import { DataExtractorResults } from './data-extractor-results';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type FileStatus = 'pending' | 'processing' | 'success' | 'error';

interface FileWithStatus {
  file: File;
  status: FileStatus;
  data?: ProcessedDocument;
  error?: string;
}

export default function BatchDataExtractorPage() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithStatus[] = acceptedFiles.map(file => ({
      file,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    }
  });

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    
    // Create a mutable copy of files to process
    const filesToProcess = files.filter(f => f.status === 'pending');
  
    for (let i = 0; i < filesToProcess.length; i++) {
        const currentFile = filesToProcess[i];
        
        // Update status in main state
        setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'processing' } : f));

        const reader = new FileReader();
        reader.readAsDataURL(currentFile.file);
    
        await new Promise<void>((resolve) => {
            reader.onload = async (readEvent) => {
            try {
                const fileDataUri = readEvent.target?.result as string;
                const result = await processDocument({ documentDataUri: fileDataUri });
                setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'success', data: result } : f));
            } catch(e: any) {
                setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'error', error: e.message || 'An unknown error occurred.' } : f));
            } finally {
                resolve();
            }
            };
            reader.onerror = () => {
                setFiles(prev => prev.map(f => f.file.name === currentFile.file.name ? { ...f, status: 'error', error: 'Failed to read the file.' } : f));
                resolve();
            };
        });
    }
  
    setIsProcessing(false);
  };
  
  const progress = files.length > 0 ? (files.filter(f => f.status === 'success' || f.status === 'error').length / files.length) * 100 : 0;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Batch Document Extractor</h1>
        <p className="text-muted-foreground">Upload multiple documents to extract data in one go.</p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors ${
                isDragActive ? 'border-primary' : 'border-border'
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                {isDragActive
                    ? 'Drop the files here ...'
                    : "Drag & drop files here, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or PDF files</p>
            </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
         <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{files.length} file(s) queued for processing.</h3>
                    <Button onClick={handleStartProcessing} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                        {isProcessing ? 'Processing...' : 'Start Extraction'}
                    </Button>
                </div>
                 {isProcessing && <Progress value={progress} className="w-full mb-4" />}
                 <ScrollArea className="h-[60vh] space-y-4">
                    <div className="space-y-4 pr-4">
                        {files.map((fileWithStatus, index) => (
                             <Card key={index} className="flex items-start gap-4 p-4">
                                <div className="flex-shrink-0 pt-1">
                                    {fileWithStatus.status === 'pending' && <Rocket className="h-5 w-5 text-muted-foreground" />}
                                    {fileWithStatus.status === 'processing' && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                                    {fileWithStatus.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    {fileWithStatus.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{fileWithStatus.file.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(fileWithStatus.file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <div className="w-2/3">
                                    {fileWithStatus.status === 'success' && fileWithStatus.data && (
                                        <DataExtractorResults processedData={fileWithStatus.data} fileName={fileWithStatus.file.name} />
                                    )}
                                    {fileWithStatus.status === 'error' && (
                                        <div className="text-destructive bg-destructive/10 p-4 rounded-md">
                                            <p className="font-bold">Error</p>
                                            <p className="text-sm">{fileWithStatus.error}</p>
                                        </div>
                                    )}
                                </div>
                             </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
         </Card>
      )}

    </div>
  );
}
