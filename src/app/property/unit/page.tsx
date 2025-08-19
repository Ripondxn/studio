
'use client';

import { useState, useMemo } from 'react';
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

type Particular = {
  id: number;
  particulars: string;
  amount: number;
  vatPercentage: number;
  vatAmount: number;
  totalAmount: number;
};

export default function UnitPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [particulars, setParticulars] = useState<Particular[]>([
    {
      id: 1,
      particulars: '',
      amount: 0,
      vatPercentage: 0,
      vatAmount: 0,
      totalAmount: 0,
    },
  ]);

  const handleParticularChange = (
    id: number,
    field: keyof Particular,
    value: string | number
  ) => {
    setParticulars((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedParticular = { ...p, [field]: value };

          if (field === 'amount' || field === 'vatPercentage') {
            const amount =
              field === 'amount'
                ? Number(value)
                : updatedParticular.amount;
            const vatPercentage =
              field === 'vatPercentage'
                ? Number(value)
                : updatedParticular.vatPercentage;
            
            const vatAmount = (amount * vatPercentage) / 100;
            const totalAmount = amount + vatAmount;

            return {
              ...updatedParticular,
              amount,
              vatPercentage,
              vatAmount,
              totalAmount,
            };
          }
          return updatedParticular;
        }
        return p;
      })
    );
  };

  const addParticularRow = () => {
    setParticulars((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
        particulars: '',
        amount: 0,
        vatPercentage: 0,
        vatAmount: 0,
        totalAmount: 0,
      },
    ]);
  };

  const removeParticularRow = (id: number) => {
    setParticulars((prev) => prev.filter((p) => p.id !== id));
  };
  
  const totalParticularsAmount = useMemo(() => {
    return particulars.reduce((sum, p) => sum + p.totalAmount, 0);
  }, [particulars]);

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const handleSaveClick = () => {
    setIsEditing(false);
    // Here you would typically save the data
  }

  const handleCancelClick = () => {
    setIsEditing(false);
    // Here you might want to reset the form to its original state
  }


  return (
    <div className="container mx-auto p-4 bg-gray-50/50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Edit Unit
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hover:bg-accent" disabled={isEditing}>
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          <Button variant="outline" className="hover:bg-accent" onClick={handleEditClick} disabled={isEditing}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          {isEditing && (
             <Button variant="outline" className="hover:bg-accent" onClick={handleSaveClick}>
                <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          )}
          <Button variant="outline" className="hover:bg-accent" disabled={!isEditing}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button variant="outline" className="hover:bg-accent" onClick={handleCancelClick}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button variant="outline" className="hover:bg-accent" disabled={isEditing}>
            <FileText className="mr-2 h-4 w-4" /> Report
          </Button>
          <Button variant="outline" className="hover:bg-accent" disabled={isEditing}>
            <Settings className="mr-2 h-4 w-4" /> Customize
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unit-code">Unit Code</Label>
                    <Input id="unit-code" defaultValue="D03-101" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="property">Property</Label>
                    <Select defaultValue="d3-china-cluster" disabled={!isEditing}>
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Select Property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="d3-china-cluster">
                          D3 China Cluster
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="floor">Floor</Label>
                    <Select defaultValue="1" disabled={!isEditing}>
                      <SelectTrigger id="floor">
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit-type">Unit Type.</Label>
                    <Select defaultValue="1-bhk" disabled={!isEditing}>
                      <SelectTrigger id="unit-type">
                        <SelectValue placeholder="Select Unit Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-bhk">1 BHK</SelectItem>
                        <SelectItem value="2-bhk">2 BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="electricity-code">Electricity Code</Label>
                    <Input id="electricity-code" defaultValue="122111" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="annual-rent">Annual Rent</Label>
                    <Input id="annual-rent" defaultValue="30000" disabled={!isEditing} />
                  </div>
                   <div>
                    <Label htmlFor="sales-man">Sales Man</Label>
                    <Select defaultValue="salesman" disabled={!isEditing}>
                      <SelectTrigger id="sales-man">
                        <SelectValue placeholder="Select Sales Man" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesman">SalesMan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unit-no">Unit No</Label>
                    <Input id="unit-no" defaultValue="D03-101" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="unit-area">Unit Area SQFT</Label>
                    <Input id="unit-area" type="number" defaultValue="721" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="view">View</Label>
                    <Input id="view" defaultValue="Good" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">No. Of Bathrooms</Label>
                    <Input id="bathrooms" type="number" defaultValue="1" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="electricity-kw">Electricity KW</Label>
                    <Input
                      id="electricity-kw"
                      type="number"
                      defaultValue="0"
                      disabled={!isEditing}
                    />
                  </div>
                   <div>
                    <Label htmlFor="monthly-rent">Monthly Rent</Label>
                    <Input id="monthly-rent" defaultValue="2500" disabled={!isEditing} />
                  </div>
                   <div>
                    <Label htmlFor="accountant">Accountant</Label>
                     <Select defaultValue="accountant" disabled={!isEditing}>
                      <SelectTrigger id="accountant">
                        <SelectValue placeholder="Select Accountant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unit-status-active">Unit Status</Label>
                    <Input id="unit-status-active" defaultValue="Active" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="landlord">LandLord</Label>
                    <Select defaultValue="landlord" disabled={!isEditing}>
                      <SelectTrigger id="landlord">
                        <SelectValue placeholder="Select Landlord" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landlord">Landlord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='relative'>
                    <Label htmlFor="unit-status-normal">Unit Status.</Label>
                     <Select defaultValue="normal" disabled={!isEditing}>
                      <SelectTrigger id="unit-status-normal">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="absolute right-0 top-6 text-muted-foreground hover:bg-transparent" disabled={!isEditing}>
                        <MinusCircle className="h-5 w-5"/>
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="parkings">No. Of Parkings</Label>
                    <Input id="parkings" type="number" defaultValue="1" disabled={!isEditing} />
                  </div>
                   <div className='flex items-end gap-2'>
                    <div className='flex-grow'>
                        <Label htmlFor="amount">Amount.</Label>
                        <Input id="amount" type="number" defaultValue="30000" disabled={!isEditing} />
                    </div>
                     <Select defaultValue="annual" disabled={!isEditing}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div>
                    <Label htmlFor="rent-sqft">Rent/Sq Ft</Label>
                    <Input id="rent-sqft" defaultValue="41.61" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="post-monthly-income">Post Monthly income for rent</Label>
                     <Select defaultValue="yes" disabled={!isEditing}>
                      <SelectTrigger id="post-monthly-income">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">YES</SelectItem>
                        <SelectItem value="no">NO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
                <div className="col-span-1 md:col-span-3 mt-6">
                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500">
                            Drag a photo here
                        </p>
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 gap-2">
                         <Button variant="link" size="sm" disabled={!isEditing}>
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                        <Button variant="link" size="sm" className="text-destructive" disabled={!isEditing}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                         <Button variant="link" size="sm" disabled={!isEditing}>
                            Pop-Up
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <Label htmlFor="discount">Discount</Label>
                    <div className="flex items-center gap-2">
                      <Input id="discount" type="number" defaultValue="0" disabled={!isEditing} />
                      <Select defaultValue="value" disabled={!isEditing}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="value">Value</SelectItem>
                           <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                   <div>
                    <Label htmlFor="rent-based-on">Rent Based On *</Label>
                     <Select defaultValue="monthly" disabled={!isEditing}>
                      <SelectTrigger id="rent-based-on">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                     <Select defaultValue="supervisor" disabled={!isEditing}>
                      <SelectTrigger id="supervisor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              <Separator className="my-6" />

              {/* Tabs Section */}
              <Tabs defaultValue="particulars" className="w-full">
                <TabsList>
                  <TabsTrigger value="particulars">Particulars</TabsTrigger>
                  <TabsTrigger value="receivables">Receivables</TabsTrigger>
                  <TabsTrigger value="vat">Vat</TabsTrigger>
                  <TabsTrigger value="unit-other-details">Unit Other Details</TabsTrigger>
                  <TabsTrigger value="payables">Payables</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="unit-rate">Unit Rate</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="particulars">
                  <div className="p-4 border rounded-md mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Sr. No.</TableHead>
                          <TableHead>Particulars</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Vat %</TableHead>
                          <TableHead className="text-right">Vat Amount</TableHead>
                          <TableHead className="text-right">Total Amount</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {particulars.map((p, index) => (
                          <TableRow key={p.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                placeholder="Enter Particulars"
                                value={p.particulars}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleParticularChange(
                                    p.id,
                                    'particulars',
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="text-right"
                                value={p.amount}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleParticularChange(
                                    p.id,
                                    'amount',
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0"
                                className="text-right"
                                value={p.vatPercentage}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleParticularChange(
                                    p.id,
                                    'vatPercentage',
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="text-right"
                                readOnly
                                value={p.vatAmount.toFixed(2)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="text-right"
                                readOnly
                                value={p.totalAmount.toFixed(2)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                disabled={!isEditing}
                                onClick={() => removeParticularRow(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                         <TableRow>
                            <TableCell colSpan={5} className="text-right font-bold">Total</TableCell>
                            <TableCell className="font-bold text-right">{totalParticularsAmount.toFixed(2)}</TableCell>
                            <TableCell></TableCell>
                         </TableRow>
                      </TableFooter>
                    </Table>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 hover:bg-accent"
                      onClick={addParticularRow}
                      disabled={!isEditing}
                    >
                      <Plus className="mr-2 h-4 w-4"/> Add
                    </Button>
                  </div>
                 </TabsContent>
                <TabsContent value="receivables">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {/* Rental Income */}
                      <div>
                        <Label>Rental Income A/c</Label>
                         <Select defaultValue="rental-income-d3" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rental-income-d3">Rental Income D3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       {/* Penalty */}
                       <div>
                        <Label>Penalty A/c</Label>
                         <Select defaultValue="penalty-income" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="penalty-income">Penalty Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bank A/c */}
                       <div>
                        <Label>Bank A/c</Label>
                         <Select defaultValue="adcb" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adcb">ADCB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Advance Rent */}
                       <div>
                        <Label>Advance Rent A/c</Label>
                         <Select defaultValue="rental-advance-reservation" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rental-advance-reservation">Rental Advance Reservation A/c</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Rental Receivable A/c */}
                      <div>
                        <Label>Rental Receivable A/c</Label>
                         <Select defaultValue="rent-receivables-d3" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rent-receivables-d3">Rent Receivables D3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Rental Advance Receivable Close A/c */}
                       <div>
                        <Label>Rental Advance Receivable Close A/c</Label>
                         <Select defaultValue="rental-advance-reservation-close" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rental-advance-reservation-close">Rental Advance Reservation Close</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Provision A/c */}
                      <div>
                        <Label>Provision A/c</Label>
                         <Select defaultValue="advance-rent-property" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advance-rent-property">Advance Rent Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                     
                    </div>
                  </div>
                </TabsContent>
                 <TabsContent value="vat">
                  <div className="p-4 border rounded-md mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account Description</TableHead>
                          <TableHead>Vat Group</TableHead>
                          <TableHead>Vat Code</TableHead>
                          <TableHead>Vat Description</TableHead>
                          <TableHead className="text-right">Vat %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Select defaultValue="rental-income-d3" disabled={!isEditing}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rental-income-d3">Rental Income D3</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                           <TableCell>
                            <Select defaultValue="vat-group" disabled={!isEditing}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vat-group">VAT Group</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                             <Input defaultValue="V5" disabled={!isEditing} />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue="Vat 5%" disabled={!isEditing} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="5" className="text-right" disabled={!isEditing} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                 </TabsContent>
                 <TabsContent value="unit-other-details">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="other-unit-no">Unit No.</Label>
                          <Input id="other-unit-no" disabled={!isEditing} />
                        </div>
                        <div>
                          <Label htmlFor="other-area-sqft">Area (SQFT)</Label>
                          <Input id="other-area-sqft" type="number" disabled={!isEditing} />
                        </div>
                        <div>
                          <Label htmlFor="other-landlord">Landlord</Label>
                          <Input id="other-landlord" disabled={!isEditing} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="other-building">Building</Label>
                          <Input id="other-building" disabled={!isEditing} />
                        </div>
                        <div>
                          <Label htmlFor="other-location">Location</Label>
                          <Input id="other-location" disabled={!isEditing} />
                        </div>
                        <div>
                          <Label htmlFor="other-sub-location">Sub Location</Label>
                          <Input id="other-sub-location" disabled={!isEditing} />
                        </div>
                      </div>
                       <div className="space-y-4">
                        <div>
                          <Label htmlFor="other-status">Status</Label>
                           <Select disabled={!isEditing}>
                            <SelectTrigger id="other-status">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="other-remarks">Remarks</Label>
                          <Textarea id="other-remarks" placeholder="Enter remarks" disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                  </div>
                 </TabsContent>
                 <TabsContent value="payables">
                   <div className="p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <Label>Commission Payable A/c</Label>
                         <Select disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="commission-payable">Commission Payable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div>
                        <Label>Security Deposit Payable A/c</Label>
                         <Select disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="security-deposit-payable">Security Deposit Payable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div>
                        <Label>Landlord Payable A/c</Label>
                         <Select disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="landlord-payable">Landlord Payable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div>
                        <Label>Other Payables A/c</Label>
                         <Select disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Account"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="other-payable">Other Payables</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                 </TabsContent>
                 <TabsContent value="attachments">
                    <div className="p-4 border rounded-md mt-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Checkbox id="check-attach" disabled={!isEditing} />
                          <Label htmlFor="check-attach">Check Attach</Label>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-accent" disabled={!isEditing}>Add New</Button>
                        <Button variant="outline" size="sm" className="hover:bg-accent" disabled={!isEditing}>Add Existing</Button>
                      </div>
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Sr. No.</TableHead>
                            <TableHead>Attachment Name</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* This is a placeholder row */}
                          <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell><Input disabled={!isEditing}/></TableCell>
                            <TableCell><Input type="file" className="text-sm" disabled={!isEditing}/></TableCell>
                            <TableCell><Input disabled={!isEditing}/></TableCell>
                            <TableCell>
                               <Button variant="ghost" size="icon" className="text-destructive" disabled={!isEditing}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button disabled={!isEditing}>Save</Button>
                        <Button variant="outline" disabled={!isEditing}>Cancel</Button>
                      </div>
                    </div>
                 </TabsContent>
                 <TabsContent value="unit-rate">
                   <div className="p-4 border rounded-md mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rate Type</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Select defaultValue="monthly" disabled={!isEditing}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="date" disabled={!isEditing} />
                          </TableCell>
                          <TableCell>
                            <Input type="date" disabled={!isEditing} />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="text-right"
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 hover:bg-accent"
                      disabled={!isEditing}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Rate
                    </Button>
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
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
              <Button 
                variant="ghost" 
                className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-accent/10 hover:border-accent"
                onClick={handleCancelClick}
                disabled={!isEditing}
                >
                  {isEditing ? (
                    <>
                      <X className="h-8 w-8" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-8 w-8" />
                      <span>Saved</span>
                    </>
                  )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
