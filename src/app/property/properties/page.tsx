

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
  FileUp,
  Link2,
  Users,
  LayoutGrid,
  List,
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
import { savePropertyData, findPropertyData, deletePropertyData, getOccupancyInfoForProperty, getUnitsForProperty, getPropertyLookups } from './actions';
import { type Unit } from '../units/schema';
import { DataTable as UnitsDataTable } from '../units/data-table';
import { columns as unitColumns } from '../units/columns';
import { AddUnitDialog } from '../units/add-unit-dialog';
import { Combobox } from '@/components/ui/combobox';
import { type Floor } from '../floors/schema';
import { getFloorsForProperty } from '../floors/actions';
import { DataTable as FloorsDataTable } from '../floors/data-table';
import { columns as floorColumns } from '../floors/columns';
import { AddFloorDialog } from '../floors/add-floor-dialog';
import { type Room } from '../rooms/schema';
import { getRoomsForProperty } from '../rooms/actions';
import { DataTable as RoomsDataTable } from '../rooms/data-table';
import { columns as roomColumns } from '../rooms/columns';
import { AddRoomDialog } from '../rooms/add-room-dialog';
import { type Partition } from '../partitions/schema';
import { getPartitionsForProperty } from '../partitions/actions';
import { DataTable as PartitionsDataTable } from '../partitions/data-table';
import { columns as partitionColumns } from '../partitions/columns';
import { AddPartitionDialog } from '../partitions/add-partition-dialog';
import { UnitGrid } from '../units/unit-grid';


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

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

type OccupancyInfo = {
    unitCode: string;
    tenantName: string;
    contractId: string;
}

type ViewMode = 'grid' | 'list';

const initialPropertyData = {
    code: '',
    name: '',
    propertyType: '',
    bondType: '',
    landlordCode: '',
    status: 'Active',
    plotArea: '0',
    builtUpArea: '0',
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
    assetManager: 'Supervisor'
};

export default function PropertyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [propertyData, setPropertyData] = useState(initialPropertyData);
  const [initialData, setInitialData] = useState(initialPropertyData);
  
  const [particulars, setParticulars] = useState<Particular[]>([]);
  const [initialParticulars, setInitialParticulars] = useState<Particular[]>([]);
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [occupancyInfo, setOccupancyInfo] = useState<OccupancyInfo[]>([]);
  const [isLoadingOccupancy, setIsLoadingOccupancy] = useState(false);

  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(false);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [isLoadingPartitions, setIsLoadingPartitions] = useState(false);
  
  const [lookups, setLookups] = useState<{ landlords: { code: string, name: string }[] }>({ landlords: [] });
  const [unitsViewMode, setUnitsViewMode] = useState<ViewMode>('grid');


  useEffect(() => {
    getPropertyLookups().then(data => setLookups(data));

    const propertyCode = searchParams.get('code');
    if (propertyCode) {
      setIsNewRecord(false);
      setPropertyData(prev => ({...prev, code: propertyCode}));
      handleFindClick(propertyCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        setInitialData(initialPropertyData);
        setPropertyData(initialPropertyData);
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.url) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, [attachments]);

  const fetchPropertySubData = (code: string) => {
    setIsLoadingUnits(true);
    getUnitsForProperty(code)
        .then(result => {
            if (result.success && result.data) {
                setUnits(result.data);
            }
        })
        .finally(() => setIsLoadingUnits(false));
    
    setIsLoadingFloors(true);
    getFloorsForProperty(code)
        .then(result => {
            if (result.success && result.data) {
                setFloors(result.data);
            }
        })
        .finally(() => setIsLoadingFloors(false));
    
    setIsLoadingRooms(true);
    getRoomsForProperty(code)
        .then(result => {
            if (result.success && result.data) {
                setRooms(result.data);
            }
        })
        .finally(() => setIsLoadingRooms(false));
    
    setIsLoadingPartitions(true);
    getPartitionsForProperty(code)
        .then(result => {
            if (result.success && result.data) {
                setPartitions(result.data);
            }
        })
        .finally(() => setIsLoadingPartitions(false));

    setIsLoadingOccupancy(true);
    getOccupancyInfoForProperty(code)
        .then(result => {
            if(result.success && result.data){
                setOccupancyInfo(result.data);
            }
        })
        .finally(() => setIsLoadingOccupancy(false));
  };


  const handleInputChange = (field: keyof typeof propertyData, value: string) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
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
  
  const handleAttachmentChange = (id: number, field: keyof Attachment, value: any) => {
    setAttachments(prev => prev.map(item => {
        if (item.id === id) {
             if (field === 'file') {
                if (item.url) URL.revokeObjectURL(item.url); // Clean up old object URL
                const newUrl = (value instanceof File) ? URL.createObjectURL(value) : undefined;
                return {...item, file: value, url: newUrl};
            }
            if (field === 'isLink') {
                 if (item.url) URL.revokeObjectURL(item.url);
                 return {...item, isLink: value, file: null, url: undefined }; // Reset file and url when switching mode
            }
            return {...item, [field]: value};
        }
        return item;
    }));
  };

  const addAttachmentRow = () => {
    setAttachments(prev => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(item => item.id)) + 1 : 1,
        name: '',
        file: null,
        remarks: '',
        isLink: false
      }
    ]);
  };

  const removeAttachmentRow = (id: number) => {
    const attachmentToRemove = attachments.find(item => item.id === id);
    if (attachmentToRemove && attachmentToRemove.url) {
        URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments(prev => prev.filter(item => item.id !== id));
  };
  
  const setAllData = (data: any) => {
    setPropertyData(data.propertyData || initialPropertyData);
    setParticulars(data.particulars || []);
    setAttachments(data.attachments ? data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
    setUploadedImage(data.propertyPhoto || null);
  }

  const setInitialAllData = (data: any) => {
    setInitialData(JSON.parse(JSON.stringify(data.propertyData || initialPropertyData)));
    setInitialParticulars(JSON.parse(JSON.stringify(data.particulars || [])));
    setInitialAttachments(JSON.parse(JSON.stringify(data.attachments ? data.attachments.map((a: any) => ({...a, file: null})) : [])));
  }

  const handleEditClick = () => {
    setInitialAllData({
      propertyData, particulars, attachments
    });
    setIsEditing(true);
  }

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        propertyData,
        particulars,
        attachments: attachments.map(a => ({
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink 
        })),
        propertyPhoto: uploadedImage 
      };

      const result = await savePropertyData(dataToSave, isNewRecord);
      if (result.success) {
        toast({
          title: "Success",
          description: `Property data for "${propertyData.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/property/properties/list`);
            router.refresh();
        } else {
            setInitialAllData(dataToSave);
        }
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
     if (isNewRecord) {
        router.push('/property/properties/list');
     } else {
        setAllData({
            propertyData: initialData,
            particulars: initialParticulars,
            attachments: initialAttachments,
        });
        setIsEditing(false);
     }
  }

  const handleCloseClick = () => {
    router.push('/property/properties/list');
  };

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
        setAllData(result.data);
        setInitialAllData(result.data);
        setIsNewRecord(false);
        setIsEditing(false);
        fetchPropertySubData(codeToFind);
        toast({
          title: 'Found',
          description: `Found record for Property Code: ${codeToFind}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Property Code: ${codeToFind}. You can create a new one.`,
        });
        const newProperty = { ...initialPropertyData, code: codeToFind };
        setAllData({ propertyData: newProperty });
        setIsNewRecord(true);
        setIsEditing(true);
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

  const handleDelete = async () => {
    if (!propertyData.code) return;
    try {
      const result = await deletePropertyData(propertyData.code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Property "${propertyData.name}" has been deleted.`,
        });
        router.push('/property/properties/list');
        router.refresh();
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete property.',
      });
    }
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
  
  const pageTitle = isNewRecord ? 'Add New Property' : `Edit Property: ${initialData.name}`;


  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2">
            {!isEditing && (
              <Button onClick={handleEditClick}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={handleSaveClick} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={handleCancelClick}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isNewRecord || isEditing}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    property "{propertyData.name}" and all its associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={handleCloseClick}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
      </div>
        <Card className='mb-6'>
            <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Basic details of the property.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" value={propertyData.code} onChange={(e) => handleInputChange('code', e.target.value)} disabled={!isNewRecord} />
                        </div>
                        <Button variant="outline" size="icon" className="hover:bg-accent" onClick={() => handleFindClick()} disabled={isFinding || !isNewRecord}>
                            {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={propertyData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="property-type">Property Type</Label>
                        <Input id="property-type" value={propertyData.propertyType} onChange={(e) => handleInputChange('propertyType', e.target.value)} disabled={!isEditing} />
                    </div>
                     <div>
                        <Label htmlFor="noOfUnits">No of Units</Label>
                        <Input id="noOfUnits" type="number" value={propertyData.noOfUnits} onChange={(e) => handleInputChange('noOfUnits', e.target.value)} disabled={!isEditing} />
                    </div>
                     <div>
                        <Label htmlFor="landlord">LandLord</Label>
                         <Combobox
                            options={lookups.landlords.map(l => ({ value: l.code, label: l.name }))}
                            value={propertyData.landlordCode}
                            onSelect={(value) => handleInputChange('landlordCode', value)}
                            placeholder="Select Landlord"
                            disabled={!isEditing}
                         />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="address1">Address</Label>
                        <Input id="address1" value={propertyData.address1} onChange={(e) => handleInputChange('address1', e.target.value)} disabled={!isEditing} />
                    </div>
                 </div>
            </CardContent>
        </Card>

      <Tabs defaultValue="units">
        <TabsList>
            <TabsTrigger value="particulars">Particulars</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="floors">Floors</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="partitions">Partitions</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="occupied-by">Occupied By</TabsTrigger>
        </TabsList>
        <TabsContent value="particulars">
          <Card>
            <CardHeader>
                <CardTitle>Financial Particulars</CardTitle>
                <CardDescription>Manage financial details and accounts related to the property.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Sno.</TableHead>
                        <TableHead>Particulars</TableHead>
                        <TableHead>Credit A/C</TableHead>
                        <TableHead>Debit A/C</TableHead>
                        <TableHead>Refund</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
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
                        <TableCell>
                            <Select value={p.refund} onValueChange={(value: 'Yes' | 'No') => handleParticularChange(p.id, 'refund', value)} disabled={!isEditing}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell><Input type="number" className="text-right" value={p.amount} onChange={e => handleParticularChange(p.id, 'amount', e.target.value)} disabled={!isEditing}/></TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="units">
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Units</CardTitle>
                        <CardDescription>Manage all units within this property.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="flex items-center rounded-md bg-muted p-1">
                            <Button variant={unitsViewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setUnitsViewMode('grid')}>
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                             <Button variant={unitsViewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setUnitsViewMode('list')}>
                                <List className="h-5 w-5" />
                            </Button>
                        </div>
                        <AddUnitDialog propertyCode={propertyData.code} onUnitAdded={() => handleFindClick(propertyData.code)} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingUnits ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : unitsViewMode === 'list' ? (
                    <UnitsDataTable columns={unitColumns} data={units} />
                ) : (
                    <UnitGrid units={units} />
                )}
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="floors">
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Floors</CardTitle>
                        <CardDescription>Manage floors for this property.</CardDescription>
                    </div>
                    <AddFloorDialog propertyCode={propertyData.code} onFloorAdded={() => fetchPropertySubData(propertyData.code)} />
                </div>
            </CardHeader>
            <CardContent>
                 {isLoadingFloors ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <FloorsDataTable columns={floorColumns} data={floors} />
                )}
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="rooms">
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Rooms</CardTitle>
                        <CardDescription>Manage rooms within this property.</CardDescription>
                    </div>
                    <AddRoomDialog propertyCode={propertyData.code} onRoomAdded={() => fetchPropertySubData(propertyData.code)} />
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingRooms ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <RoomsDataTable columns={roomColumns} data={rooms} />
                )}
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="partitions">
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Partitions</CardTitle>
                        <CardDescription>Manage partitions for units in this property.</CardDescription>
                    </div>
                    <AddPartitionDialog propertyCode={propertyData.code} onPartitionAdded={() => fetchPropertySubData(propertyData.code)} />
                </div>
            </CardHeader>
            <CardContent>
                 {isLoadingPartitions ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <PartitionsDataTable columns={partitionColumns} data={partitions} />
                )}
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="attachments">
            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>Manage documents and links related to the property.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Attachment Name</TableHead>
                        <TableHead>File / Link</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attachments.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Input 
                                        value={item.name} 
                                        onChange={(e) => handleAttachmentChange(item.id, 'name', e.target.value)} 
                                        disabled={!isEditing} 
                                        placeholder="e.g. Title Deed"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {item.isLink ? (
                                            <Input
                                                type="text"
                                                placeholder="https://example.com"
                                                value={typeof item.file === 'string' ? item.file : ''}
                                                onChange={(e) => handleAttachmentChange(item.id, 'file', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Input 
                                                type="file" 
                                                className="text-sm w-full" 
                                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                                onChange={(e) => handleAttachmentChange(item.id, 'file', e.target.files ? e.target.files[0] : null)}
                                                disabled={!isEditing}
                                            />
                                        )}
                                            <Button variant="ghost" size="icon" onClick={() => handleAttachmentChange(item.id, 'isLink', !item.isLink)} disabled={!isEditing}>
                                            {item.isLink ? <FileUp className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                        {item.url && !item.isLink && (
                                        <Link href={item.url} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                            View Uploaded File
                                        </Link>
                                    )}
                                    {item.file && typeof item.file === 'string' && (
                                        item.isLink && item.file.startsWith('http') ? (
                                            <Link href={item.file} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                                Open Link
                                            </Link>
                                        ) : (
                                            !item.isLink && <span className="text-sm text-muted-foreground italic truncate">{item.file}</span>
                                        )
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={item.remarks} 
                                        onChange={(e) => handleAttachmentChange(item.id, 'remarks', e.target.value)} 
                                        disabled={!isEditing} 
                                        placeholder="Add remarks..."
                                    />
                                </TableCell>
                                <TableCell>
                                <Button variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeAttachmentRow(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                     <Button variant="outline" size="sm" className="mt-4 hover:bg-accent" onClick={addAttachmentRow} disabled={!isEditing}>
                        <Plus className="mr-2 h-4 w-4"/> Add Attachment
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="occupied-by">
            <Card>
                <CardHeader>
                    <CardTitle>Occupied By</CardTitle>
                    <CardDescription>List of tenants currently occupying units in {propertyData.name || 'this property'}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingOccupancy ? (
                         <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : occupancyInfo.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit Code</TableHead>
                                    <TableHead>Tenant Name</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {occupancyInfo.map(info => (
                                    <TableRow key={info.contractId}>
                                        <TableCell>{info.unitCode}</TableCell>
                                        <TableCell>{info.tenantName}</TableCell>
                                        <TableCell>
                                            <Button asChild variant="link">
                                                <Link href={`/tenancy/contract?id=${info.contractId}`}>View Contract</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <Users className="mx-auto h-12 w-12" />
                            <p className="mt-4">No occupancy information found for this property.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
