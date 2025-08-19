import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Home,
  CheckCircle2,
  XCircle,
  FileText,
  Bookmark,
  Bed,
  Moon,
} from 'lucide-react';
import { TotalUnitsChart } from '@/components/total-units-chart';
import { VacantUnitsChart } from '@/components/vacant-units-chart';
import { ActiveUnitsChart } from '@/components/active-units-chart';
import { ExpiredUnitsChart } from '@/components/expired-units-chart';
import { CasesUnitsChart } from '@/components/cases-units-chart';
import { ReservedUnitsChart } from '@/components/reserved-units-chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-cyan-100 border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unit</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">452</div>
          </CardContent>
        </Card>
        <Card className="bg-lime-100 border-lime-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">371</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">53</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Total Unit
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="doughnut">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doughnut">Doughnut</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-total" />
                <Label htmlFor="d3-total">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] -mt-4">
            <TotalUnitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Vacant Units
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="pie">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="doughnut">Doughnut</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-vacant" />
                <Label htmlFor="d3-vacant">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] -mt-4">
            <VacantUnitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Active Units
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="funnel">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funnel">Funnel</SelectItem>
                  <SelectItem value="pyramid">Pyramid</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-active" />
                <Label htmlFor="d3-active">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] -mt-4">
            <ActiveUnitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Expired Units
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="column">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-expired" />
                <Label htmlFor="d3-expired">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ExpiredUnitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Cases Units
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="bar">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-cases" />
                <Label htmlFor="d3-cases">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CasesUnitsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Reserved Units
            </CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Select defaultValue="pyramid">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pyramid">Pyramid</SelectItem>
                  <SelectItem value="funnel">Funnel</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox id="d3-reserved" />
                <Label htmlFor="d3-reserved">3D</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ReservedUnitsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}