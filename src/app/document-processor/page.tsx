
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, X, AlertCircle } from 'lucide-react';
import { extractDataFromDocument, getPartyLookups } from './actions';
import { type ProcessedDocument } from '@/ai/flows/process-document-flow';
import { DocumentProcessorForm } from './document-processor-form';
import { type UserRole } from '../admin/user-roles/schema';
import { Button } from '@/components/ui/button';

type PartyLookups = {
    vendors: { value: string, label: string }[];
    tenants: { value: string, label: string }[];
    customers: { value: string, label: string }[];
}

export default function DocumentProcessorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lookups, setLookups] = useState<PartyLookups>({ vendors: [], tenants: [], customers: [] });
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);


  useEffect(() => {
    getPartyLookups().then(setLookups);
     const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        setCurrentUser(JSON.parse(storedProfile));
    }
  }, []);
  
  const processFile = useCallback(async (fileDataUri: string) => {
    setIsLoading(true);
    setProcessedData(null);
    setError(null);
    const result = await extractDataFromDocument({ documentDataUri: fileDataUri });
    if (result.success && result.data) {
        setProcessedData(result.data);
    } else {
        setError(result.error || 'Failed to extract data from the document.');
    }
    setIsLoading(false);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (readEvent) => {
          if (readEvent.target?.result) {
            setFilePreview(readEvent.target.result as string);
            processFile(readEvent.target.result as string);
          }
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [processFile]);

  const handleReset = () => {
      setFile(null);
      setFilePreview(null);
      setIsLoading(false);
      setProcessedData(null);
      setError(null);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    }
  });
  
  if (!currentUser) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Document Processor</h1>
        <p className="text-muted-foreground">Upload an invoice, receipt, or bill to automatically extract the data.</p>
      </div>
      
      {!filePreview && (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors ${
            isDragActive ? 'border-primary' : 'border-border'
            }`}
        >
            <input {...getInputProps()} />
            <FileUp className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
            {isDragActive
                ? 'Drop the file here ...'
                : "Drag 'n' drop a file here, or click to select a file"}
            </p>
             <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or PDF</p>
        </div>
      )}

      {filePreview && (
          <div className="relative">
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={handleReset}>
                  <X className="h-4 w-4"/>
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     {file?.type.startsWith('image/') ? (
                        <img src={filePreview} alt="Preview" className="rounded-lg object-contain w-full h-full max-h-[80vh]" />
                    ) : (
                        <iframe src={filePreview} className="w-full h-[80vh] rounded-lg border"/>
                    )}
                </div>
                <div className="space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-lg">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Analyzing document with AI...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 bg-destructive/10 p-4 rounded-lg">
                            <h3 className="font-bold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Analysis Failed</h3>
                            <p className="text-sm mt-2">{error}</p>
                        </div>
                    )}
                    {processedData && (
                        <DocumentProcessorForm 
                            processedData={processedData} 
                            lookups={lookups} 
                            currentUser={currentUser}
                            onSuccess={handleReset}
                        />
                    )}
                </div>
              </div>
          </div>
      )}
    </div>
  );
}
