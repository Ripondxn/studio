
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type VisibleSections = {
  propertyDetails: boolean;
  photoUpload: boolean;
  discountAndRent: boolean;
  tabs: boolean;
};

type CustomizeDialogProps = {
  visibleSections: VisibleSections;
  onVisibilityChange: (sections: VisibleSections) => void;
};

export function CustomizeDialog({
  visibleSections,
  onVisibilityChange,
}: CustomizeDialogProps) {
  const handleCheckboxChange = (section: keyof VisibleSections) => {
    onVisibilityChange({
      ...visibleSections,
      [section]: !visibleSections[section],
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Customize Form</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <p className="text-sm text-muted-foreground">
          Select the sections you want to display on the form.
        </p>
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
      <DialogFooter>
        {/* The DialogClose is part of the DialogContent so no button is needed here */}
      </DialogFooter>
    </DialogContent>
  );
}
