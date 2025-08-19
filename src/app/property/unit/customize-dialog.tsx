
'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'file';
};

type VisibleSections = {
  propertyDetails: boolean;
  photoUpload: boolean;
  discountAndRent: boolean;
  tabs: boolean;
};

type CustomizeDialogProps = {
  visibleSections: VisibleSections;
  onVisibilityChange: (sections: VisibleSections) => void;
  customFields: CustomField[];
  onCustomFieldsChange: (fields: CustomField[]) => void;
};

export function CustomizeDialog({
  visibleSections,
  onVisibilityChange,
  customFields: initialCustomFields,
  onCustomFieldsChange,
}: CustomizeDialogProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>(initialCustomFields);

  const handleCheckboxChange = (section: keyof VisibleSections) => {
    onVisibilityChange({
      ...visibleSections,
      [section]: !visibleSections[section],
    });
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: `custom-${Date.now()}`, label: '', type: 'text' },
    ]);
  };

  const updateCustomField = (id: string, newField: Partial<CustomField>) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, ...newField } : field
      )
    );
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };
  
  const handleApplyCustomFields = () => {
    onCustomFieldsChange(customFields);
  };


  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Customize Form</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
            <h3 className="font-semibold mb-2">Visible Sections</h3>
            <p className="text-sm text-muted-foreground mb-4">
            Select the sections you want to display on the form.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="propertyDetails"
                    checked={visibleSections.propertyDetails}
                    onCheckedChange={() => handleCheckboxChange('propertyDetails')}
                />
                <Label htmlFor="propertyDetails">Property Details</Label>
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="photoUpload"
                    checked={visibleSections.photoUpload}
                    onCheckedChange={() => handleCheckboxChange('photoUpload')}
                />
                <Label htmlFor="photoUpload">Photo Upload</Label>
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="discountAndRent"
                    checked={visibleSections.discountAndRent}
                    onCheckedChange={() => handleCheckboxChange('discountAndRent')}
                />
                <Label htmlFor="discountAndRent">Discount & Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox
                    id="tabs"
                    checked={visibleSections.tabs}
                    onCheckedChange={() => handleCheckboxChange('tabs')}
                />
                <Label htmlFor="tabs">Tabs Section (Particulars, VAT, etc.)</Label>
                </div>
            </div>
        </div>

        <Separator />

        <div>
            <h3 className="font-semibold mb-2">Custom Fields</h3>
            <p className="text-sm text-muted-foreground mb-4">
            Add your own fields to the form. These will appear in a new "Custom Details" section.
            </p>
            <div className="space-y-4">
            {customFields.map((field) => (
                <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                <div className="flex-grow">
                    <Label htmlFor={`${field.id}-label`}>Field Label</Label>
                    <Input
                    id={`${field.id}-label`}
                    placeholder="e.g., Pet Policy"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                    />
                </div>
                <div className="w-[150px]">
                    <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                    <Select
                    value={field.type}
                    onValueChange={(value: CustomField['type']) =>
                        updateCustomField(field.id, { type: value })
                    }
                    >
                    <SelectTrigger id={`${field.id}-type`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="file">File Attachment</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeCustomField(field.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            ))}
            </div>
            <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={addCustomField}
            >
            <Plus className="mr-2 h-4 w-4" /> Add Field
            </Button>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleApplyCustomFields}>Apply Changes</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
