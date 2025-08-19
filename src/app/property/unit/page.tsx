import {
  Card,
  CardContent,
  CardDescription,
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
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function UnitPage() {
  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Edit Unit
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hover:bg-accent">
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          <Button variant="outline" className="hover:bg-accent">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline" className="hover:bg-accent">
            <FileText className="mr-2 h-4 w-4" /> Report
          </Button>
          <Button variant="outline" className="hover:bg-accent">
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
                    <Input id="unit-code" defaultValue="D03-101" />
                  </div>
                  <div>
                    <Label htmlFor="property">Property</Label>
                    <Select defaultValue="d3-china-cluster">
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
                    <Select defaultValue="1">
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
                    <Select defaultValue="1-bhk">
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
                    <Input id="electricity-code" defaultValue="122111" />
                  </div>
                  <div>
                    <Label htmlFor="annual-rent">Annual Rent</Label>
                    <Input id="annual-rent" defaultValue="30000" />
                  </div>
                   <div>
                    <Label htmlFor="sales-man">Sales Man</Label>
                    <Select defaultValue="salesman">
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
                    <Input id="unit-no" defaultValue="D03-101" />
                  </div>
                  <div>
                    <Label htmlFor="unit-area">Unit Area SQFT</Label>
                    <Input id="unit-area" type="number" defaultValue="721" />
                  </div>
                  <div>
                    <Label htmlFor="view">View</Label>
                    <Input id="view" defaultValue="Good" />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">No. Of Bathrooms</Label>
                    <Input id="bathrooms" type="number" defaultValue="1" />
                  </div>
                  <div>
                    <Label htmlFor="electricity-kw">Electricity KW</Label>
                    <Input
                      id="electricity-kw"
                      type="number"
                      defaultValue="0"
                    />
                  </div>
                   <div>
                    <Label htmlFor="monthly-rent">Monthly Rent</Label>
                    <Input id="monthly-rent" defaultValue="2500" />
                  </div>
                   <div>
                    <Label htmlFor="accountant">Accountant</Label>
                     <Select defaultValue="accountant">
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
                    <Select defaultValue="landlord">
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
                     <Select defaultValue="normal">
                      <SelectTrigger id="unit-status-normal">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="absolute right-0 top-6 text-muted-foreground hover:bg-transparent">
                        <MinusCircle className="h-5 w-5"/>
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="parkings">No. Of Parkings</Label>
                    <Input id="parkings" type="number" defaultValue="1" />
                  </div>
                   <div className='flex items-end gap-2'>
                    <div className='flex-grow'>
                        <Label htmlFor="amount">Amount.</Label>
                        <Input id="amount" type="number" defaultValue="30000" />
                    </div>
                     <Select defaultValue="annual">
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
                     <Select defaultValue="yes">
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
                         <Button variant="link" size="sm">
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                        <Button variant="link" size="sm" className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                         <Button variant="link" size="sm">
                            Pop-Up
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <Label htmlFor="discount">Discount</Label>
                    <div className="flex items-center gap-2">
                      <Input id="discount" type="number" defaultValue="0" />
                      <Select defaultValue="value">
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
                     <Select defaultValue="monthly">
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
                     <Select defaultValue="supervisor">
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
              <Tabs defaultValue="receivables" className="w-full">
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
                <TabsContent value="receivables">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {/* Rental Income */}
                      <div>
                        <Label>Rental Income A/c</Label>
                         <Select defaultValue="rental-income-d3">
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
                         <Select defaultValue="penalty-income">
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
                         <Select defaultValue="adcb">
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
                         <Select defaultValue="rental-advance-reservation">
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
                         <Select defaultValue="rent-receivables-d3">
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
                         <Select defaultValue="rental-advance-reservation-close">
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
                         <Select defaultValue="advance-rent-property">
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
                 <TabsContent value="particulars">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Particulars details will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="vat">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">VAT details will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="unit-other-details">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Other unit details will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="payables">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Payables details will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="attachments">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Attachments will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="unit-rate">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Unit rate details will be shown here.</div>
                 </TabsContent>
                 <TabsContent value="notes">
                  <div className="p-4 border rounded-md mt-2 text-muted-foreground">Notes will be shown here.</div>
                 </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Reports</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-48">
              <Button variant="ghost" className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-accent/10 hover:border-accent">
                <X className="h-8 w-8" />
                <span>Cancel</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
