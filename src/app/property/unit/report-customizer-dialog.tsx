
'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { CustomField } from './customize-dialog';

export type ReportConfig = {
  unitDetails: string[];
  particulars: string[];
  customDetails: string[];
};

type ReportCustomizerDialogProps = {
  unitDataFields: string[];
  particularsFields: string[];
  customFields: CustomField[];
  onGenerateReport: (config: ReportConfig) => void;
};

// Helper to format camelCase to Title Case
const toTitleCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};


export function ReportCustomizerDialog({
  unitDataFields,
  particularsFields,
  customFields,
  onGenerateReport,
}: ReportCustomizerDialogProps) {
  const [selectedUnitFields, setSelectedUnitFields] = useState<string[]>(unitDataFields);
  const [selectedParticularsFields, setSelectedParticularsFields] = useState<string[]>(particularsFields.filter(f => f !== 'id'));
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>(customFields.map(f => f.id));

  const handleToggle = (
    field: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(field)) {
      setter(list.filter((item) => item !== field));
    } else {
      setter([...list, field]);
    }
  };

  const handleSelectAll = (
    allFields: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(allFields);
  }

  const handleDeselectAll = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter([]);
  }

  const handleGenerateClick = () => {
    onGenerateReport({
      unitDetails: selectedUnitFields,
      particulars: selectedParticularsFields,
      customDetails: selectedCustomFields,
    });
  };
  
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Customize Report</DialogTitle>
        <DialogDescription>
          Select the fields you want to include in the report.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-6 p-1">
          {/* Unit Details Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Unit Details</h3>
                <div>
                    <Button variant="link" size="sm" onClick={() => handleSelectAll(unitDataFields, setSelectedUnitFields)}>Select All</Button>
                    <Button variant="link" size="sm" onClick={() => handleDeselectAll(setSelectedUnitFields)}>Deselect All</Button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 border rounded-md">
              {unitDataFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`unit-${field}`}
                    checked={selectedUnitFields.includes(field)}
                    onCheckedChange={() => handleToggle(field, selectedUnitFields, setSelectedUnitFields)}
                  />
                  <Label htmlFor={`unit-${field}`}>{toTitleCase(field)}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />

          {/* Particulars Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Particulars</h3>
                 <div>
                    <Button variant="link" size="sm" onClick={() => handleSelectAll(particularsFields.filter(f => f !== 'id'), setSelectedParticularsFields)}>Select All</Button>
                    <Button variant="link" size="sm" onClick={() => handleDeselectAll(setSelectedParticularsFields)}>Deselect All</Button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 border rounded-md">
              {particularsFields.filter(f => f !== 'id').map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`part-${field}`}
                    checked={selectedParticularsFields.includes(field)}
                    onCheckedChange={() => handleToggle(field, selectedParticularsFields, setSelectedParticularsFields)}
                  />
                  <Label htmlFor={`part-${field}`}>{toTitleCase(field)}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          
          {/* Custom Details Section */}
          {customFields.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Custom Details</h3>
                 <div>
                    <Button variant="link" size="sm" onClick={() => handleSelectAll(customFields.map(f => f.id), setSelectedCustomFields)}>Select All</Button>
                    <Button variant="link" size="sm" onClick={() => handleDeselectAll(setSelectedCustomFields)}>Deselect All</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-4 border rounded-md">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`custom-${field.id}`}
                      checked={selectedCustomFields.includes(field.id)}
                      onCheckedChange={() => handleToggle(field.id, selectedCustomFields, setSelectedCustomFields)}
                    />
                    <Label htmlFor={`custom-${field.id}`}>{field.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button onClick={handleGenerateClick}>Generate Report</Button>
      </DialogFooter>
    </DialogContent>
  );
}

