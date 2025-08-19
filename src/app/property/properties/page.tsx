

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Copy,
  Save,
  FileText,
  Settings,
  X,
  Upload,
  Trash2,
  MinusCircle,
  Plus,
  Pencil,
  Check,
  Loader2,
  Search,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { savePropertyData, findPropertyData } from './actions';
// Re-using the same dialogs and types from the unit page for consistency
import { CustomizeDialog, type CustomField } from '@/app/property/unit/customize-dialog';
import { FormItem } from '@/components/ui/form';
import { ReportCustomizerDialog, type ReportConfig } from '@/app/property/unit/report-customizer-dialog';


type Particular = {
  id: number;
  particulars: string;
  creditAc: string;
  debitAc: string;
  advanceAc: string;
  refund: 'Yes' | 'No';
  percentage: number;
  amount: number;
  amountMonths: number;
  vatPercentage: number;
  taxCategory: string;
};

const initialPropertyData = {
    code: 'MT',
    name: 'Meras Tower',
    propertyType: '',
    bondType: '',
    landlord: 'Landlord',
    status: 'Active',
    plotArea: '0',
    builtUpArea: '500000',
    noOfFloors: '0',
    noOfUnits: '0',
    noOfParkings: '0',
    address1: '',
    address2: '',
    emirates: '',
    country1: '',
    propertyPosition: '',
    accountant: 'Accountant',
    salesMan: 'SalesMan',
    location: 'Location',
    towerType: 'Rent',
    gps: '',
    propertyNo: '',
    assetManager: 'Supervisor',
};

export default function PropertyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [propertyData, setPropertyData] = useState(initialPropertyData);
  const [initialData, setInitialData] = useState(initialPropertyData);
  
  const [particulars, setParticulars] = useState<Particular[]>([]);
  const [initialParticulars, setInitialParticulars] = useState<Particular[]>([]);

  const [visibleSections, setVisibleSections] = useState({
    propertyDetails: true,
    photoUpload: true,
    discountAndRent: true,
    tabs: true,
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});
  const [isReportDialog, setIsReportDialog] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const propertyCode = searchParams.get('code');
    if (propertyCode) {
      setPropertyData(prev => ({...prev, code: propertyCode}));
      handleFindClick(propertyCode);
    } else {
        setIsEditing(true); 
    }
  }, [searchParams]);



  const handleInputChange = (field: keyof typeof propertyData, value: string) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldsData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleParticularChange = (
    id: number,
    field: keyof Particular,
    value: string | number
  ) => {
    setParticulars((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addParticularRow = () => {
    setParticulars((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
        particulars: '',
        creditAc: '',
        debitAc: '',
        advanceAc: '',
        refund: 'No',
        percentage: 0,
        amount: 0,
        amountMonths: 0,
        vatPercentage: 0,
        taxCategory: ''
      },
    ]);
  };

  const removeParticularRow = (id: number) => {
    setParticulars((prev) => prev.filter((p) => p.id !== id));
  };
  
  const totalParticularsAmount = useMemo(() => {
    return particulars.reduce((sum, p) => sum + p.amount, 0);
  }, [particulars]);

  const handleEditClick = () => {
    setInitialData(JSON.parse(JSON.stringify(propertyData)));
    setInitialParticulars(JSON.parse(JSON.stringify(particulars)));
    setIsEditing(true);
  }

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        propertyData,
        particulars,
        customFieldsData,
        propertyPhoto: uploadedImage 
      };

      const result = await savePropertyData(dataToSave);
      if (result.success) {
        toast({
          title: "Success",
          description: "Property data saved successfully.",
        });
        setIsEditing(false);
        setInitialData(propertyData);
        setInitialParticulars(JSON.parse(JSON.stringify(particulars)));
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to save property data.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleCancelClick = () => {
     if (isEditing) {
      setPropertyData(initialData);
      setParticulars(initialParticulars);
      setIsEditing(false);
    } else {
      router.push('/property/properties/list');
    }
  }

  const handleFindClick = async (code?: string) => {
    const codeToFind = code || propertyData.code;
    if (!codeToFind) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a Property Code to find.',
      });
      return;
    }
    setIsFinding(true);
    try {
      const result = await findPropertyData(codeToFind);
      if (result.success && result.data) {
        toast({
          title: 'Found',
          description: `Found record for Property Code: ${codeToFind}`,
        });
         const mockData = {
          ...initialPropertyData, 
          ...result.data
        }
        setPropertyData(mockData);
        setInitialData(mockData);
        setIsEditing(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || `No record found for Property Code: ${codeToFind}`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          (error as Error).message || 'Failed to find property data.',
      });
    } finally {
      setIsFinding(false);
    }
  };

  const handleGenerateReport = (reportConfig: ReportConfig) => {
    const reportData = {
      unitData: propertyData,
      particulars,
      customFields,
      customFieldsData,
      reportConfig,
    };
    const dataString = encodeURIComponent(JSON.stringify(reportData));
    router.push(`/property/unit/report?data=${dataString}`);
    setIsReportDialog(false);
  };

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        toast({
            variant: "destructive",
            title: "Invalid File",
            description: "Please select an image file."
        })
    }
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isEditing) return;
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file || null);
  };
  
  const pageTitle = searchParams.get('code') ? 'Edit Property' : 'Add New Property';


  return (
    <div className="container mx-auto p-4 bg-gray-50/50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="hover:bg-accent" disabled={!isEditing} onClick={handleSaveClick}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
             {isSaving ? 'Saving...' : 'Save'}
           </Button>
           <Dialog open={isReportDialog} onOpenChange={setIsReportDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:bg-accent" disabled={isEditing}>
                    <FileText className="mr-2 h-4 w-4" /> Report
                </Button>
            </DialogTrigger>
            <ReportCustomizerDialog
              unitDataFields={Object.keys(propertyData)}
              particularsFields={Object.keys(particulars[0] || {})}
              customFields={customFields}
              onGenerateReport={handleGenerateReport}
            />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:bg-accent">
                <Settings className="mr-2 h-4 w-4" /> Customize
              </Button>
            </DialogTrigger>
            <CustomizeDialog
              visibleSections={visibleSections}
              onVisibilityChange={setVisibleSections}
              customFields={customFields}
              onCustomFieldsChange={setCustomFields}
            />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" value={propertyData.code} onChange={(e) => handleInputChange('code', e.target.value)} disabled={!isEditing && !!searchParams.get('code')} />
                    </div>
                    <Button variant="outline" size="icon" className="hover:bg-accent" onClick={() => handleFindClick()} disabled={isFinding}>
                        {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="bond-type">Bond Type</Label>
                    <Input id="bond-type" value={propertyData.bondType} onChange={(e) => handleInputChange('bondType', e.target.value)} disabled={!isEditing} />
                  </div>
                   <div>
                    <Label htmlFor="plot-area">Plot Area</Label>
                    <Input id="plot-area" type="number" value={propertyData.plotArea} onChange={(e) => handleInputChange('plotArea', e.target.value)} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="no-of-units">No of Units</Label>
                    <Input id="no-of-units" type="number" value={propertyData.noOfUnits} onChange={(e) => handleInputChange('noOfUnits', e.target.value)} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address2</Label>
                    <Input id="address2" value={propertyData.address2} onChange={(e) => handleInputChange('address2', e.target.value)} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="property-position">Property Position</Label>
                    <Select value={propertyData.propertyPosition} onValueChange={(value) => handleInputChange('propertyPosition', value)} disabled={!isEditing}>
                      <SelectTrigger id="property-position">
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pos-1">Position 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                     <Select value={propertyData.location} onValueChange={(value) => handleInputChange('location', value)} disabled={!isEditing}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Location">Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={propertyData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="landlord">LandLord</Label>
                    <Select value={propertyData.landlord} onValueChange={(value) => handleInputChange('landlord', value)} disabled={!isEditing}>
                      <SelectTrigger id="landlord">
                        <SelectValue placeholder="Select Landlord" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Landlord">Landlord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="built-up-area">Built Up Area</Label>
                    <Input id="built-up-area" type="number" value={propertyData.builtUpArea} onChange={(e) => handleInputChange('builtUpArea', e.target.value)} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="no-of-parkings">No of Parkings</Label>
                    <Input id="no-of-parkings" type="number" value={propertyData.noOfParkings} onChange={(e) => handleInputChange('noOfParkings', e.target.value)} disabled={!isEditing} />
                  </div>
                   <div>
                    <Label htmlFor="emirates">Emirates</Label>
                    <Input id="emirates" value={propertyData.emirates} onChange={(e) => handleInputChange('emirates', e.target.value)} disabled={!isEditing} />
                  </div>
                   <div>
                    <Label htmlFor="accountant">Accountant</Label>
                     <Select value={propertyData.accountant} onValueChange={(value) => handleInputChange('accountant', value)} disabled={!isEditing}>
                      <SelectTrigger id="accountant">
                        <SelectValue placeholder="Select Accountant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div>
                    <Label htmlFor="tower-type">Tower Type</Label>
                     <Select value={propertyData.towerType} onValueChange={(value) => handleInputChange('towerType', value)} disabled={!isEditing}>
                      <SelectTrigger id="tower-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="property-type">Property Type</Label>
                        <Input id="property-type" value={propertyData.propertyType} onChange={(e) => handleInputChange('propertyType', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={propertyData.status} onValueChange={(value) => handleInputChange('status', value)} disabled={!isEditing}>
                            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Active">Active</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="no-of-floors">No of Floors</Label>
                        <Input id="no-of-floors" type="number" value={propertyData.noOfFloors} onChange={(e) => handleInputChange('noOfFloors', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="address1">Address1</Label>
                        <Input id="address1" value={propertyData.address1} onChange={(e) => handleInputChange('address1', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="country1">Country1</Label>
                        <Input id="country1" value={propertyData.country1} onChange={(e) => handleInputChange('country1', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="sales-man">Sales Man</Label>
                        <Select value={propertyData.salesMan} onValueChange={(value) => handleInputChange('salesMan', value)} disabled={!isEditing}>
                        <SelectTrigger id="sales-man">
                            <SelectValue placeholder="Select Sales Man" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SalesMan">SalesMan</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="gps">GPS</Label>
                        <Input id="gps" value={propertyData.gps} onChange={(e) => handleInputChange('gps', e.target.value)} disabled={!isEditing} />
                    </div>
                </div>
              </div>
              <Separator className="my-6" />
              <Tabs defaultValue="particulars" className="w-full">
                <TabsList>
                  <TabsTrigger value="particulars">Particulars</TabsTrigger>
                  <TabsTrigger value="receivables">Receivables</TabsTrigger>
                  <TabsTrigger value="vat">Vat</TabsTrigger>
                  <TabsTrigger value="property-other-details">Property Other Details</TabsTrigger>
                  <TabsTrigger value="special-conditions">Special Conditions</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="parkings">Parkings</TabsTrigger>
                  <TabsTrigger value="assign">Assign</TabsTrigger>
                  <TabsTrigger value="share-holder">Share Holder</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="particulars">
                  <div className="p-4 border rounded-md mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Sno.</TableHead>
                          <TableHead>Particulars</TableHead>
                          <TableHead>Credit A/C</TableHead>
                          <TableHead>Debit A/C</TableHead>
                          <TableHead>Advance A/c</TableHead>
                          <TableHead>Refund</TableHead>
                          <TableHead className="text-right">%</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Amount(Months)</TableHead>
                          <TableHead className="text-right">VAT(%)</TableHead>
                          <TableHead>TaxCategory</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {particulars.map((p, index) => (
                          <TableRow key={p.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell><Input value={p.particulars} onChange={e => handleParticularChange(p.id, 'particulars', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input value={p.creditAc} onChange={e => handleParticularChange(p.id, 'creditAc', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input value={p.debitAc} onChange={e => handleParticularChange(p.id, 'debitAc', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input value={p.advanceAc} onChange={e => handleParticularChange(p.id, 'advanceAc', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell>
                                <Select value={p.refund} onValueChange={(value: 'Yes' | 'No') => handleParticularChange(p.id, 'refund', value)} disabled={!isEditing}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell><Input type="number" className="text-right" value={p.percentage} onChange={e => handleParticularChange(p.id, 'percentage', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input type="number" className="text-right" value={p.amount} onChange={e => handleParticularChange(p.id, 'amount', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input type="number" className="text-right" value={p.amountMonths} onChange={e => handleParticularChange(p.id, 'amountMonths', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input type="number" className="text-right" value={p.vatPercentage} onChange={e => handleParticularChange(p.id, 'vatPercentage', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell><Input value={p.taxCategory} onChange={e => handleParticularChange(p.id, 'taxCategory', e.target.value)} disabled={!isEditing}/></TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeParticularRow(p.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button variant="outline" size="sm" className="mt-4 hover:bg-accent" onClick={addParticularRow} disabled={!isEditing}>
                      <Plus className="mr-2 h-4 w-4"/> Add
                    </Button>
                  </div>
                 </TabsContent>
                 <TabsContent value="receivables">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Receivable A/c</Label>
                          <Select disabled={!isEditing} defaultValue="receivable-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="receivable-ac">Receivable A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Bank A/c</Label>
                          <Select disabled={!isEditing} defaultValue="bank-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="bank-ac">Bank A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Penalty A/c</Label>
                          <Select disabled={!isEditing} defaultValue="penalty-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="penalty-ac">Penalty A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <div>
                          <Label>Income A/c</Label>
                          <Select disabled={!isEditing} defaultValue="income-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="income-ac">Income A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Advance A/c</Label>
                          <Select disabled={!isEditing} defaultValue="advance-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="advance-ac">Advance A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                       <div className="space-y-4">
                         <div>
                          <Label>Discount A/c</Label>
                          <Select disabled={!isEditing} defaultValue="discount-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="discount-ac">Discount A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                         <div>
                          <Label>Deposit A/c</Label>
                          <Select disabled={!isEditing} defaultValue="deposit-ac">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="deposit-ac">Deposit A/c</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                 </TabsContent>
                 <TabsContent value="notes">
                   <div className="p-4 border rounded-md mt-2">
                    <Textarea placeholder="Enter any notes here..." disabled={!isEditing} />
                  </div>
                 </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle className="font-headline">Photo</CardTitle></CardHeader>
                <CardContent>
                    <div 
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative"
                        onDrop={handleImageDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {uploadedImage ? (
                        <Image src={uploadedImage} alt="Property preview" layout="fill" objectFit="contain" className="rounded-lg" />
                        ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Drag a photo here</span>
                            </p>
                        </div>
                        )}
                        <Input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        disabled={!isEditing}
                        />
                    </div>
                    <div className="flex justify-center mt-2 gap-2 text-sm">
                        <Button variant="link" size="sm" disabled={!isEditing} onClick={() => fileInputRef.current?.click()}>
                            Upload
                        </Button>
                        <Button variant="link" size="sm" className="text-destructive" disabled={!isEditing || !uploadedImage} onClick={() => setUploadedImage(null)}>
                            Delete
                        </Button>
                        <Button variant="link" size="sm" disabled={!isEditing}>
                            Pop-Up
                        </Button>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div>
                            <Label htmlFor="property-no">Property No</Label>
                            <Input id="property-no" value={propertyData.propertyNo} onChange={(e) => handleInputChange('propertyNo', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div>
                            <Label htmlFor="asset-manager">AssetManager</Label>
                            <Select value={propertyData.assetManager} onValueChange={(value) => handleInputChange('assetManager', value)} disabled={!isEditing}>
                            <SelectTrigger id="asset-manager">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
            <CardHeader>
              <CardTitle className="font-headline">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-48 gap-4">
               {!isEditing && (
                 <Button onClick={handleEditClick} className="w-full">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                 </Button>
                )}
              {isEditing && (
                <>
                <Button onClick={handleSaveClick} disabled={isSaving} className="w-full">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={handleCancelClick} className="w-full">
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

