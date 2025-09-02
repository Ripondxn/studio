
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { type FeaturePermission } from '@/app/admin/access-control/permissions';
import { getCombinedAccessControlData } from '@/app/admin/access-control/actions';
import { type ModuleSettings } from '@/app/admin/access-control/schema';
import { Loader2 } from 'lucide-react';

interface AuthorizationContextType {
  can: (feature: string, action: string) => boolean;
  isModuleEnabled: (moduleId: string) => boolean;
  isLoading: boolean;
  userRole: UserRole['role'] | null;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

const featureToModuleMap: Record<string, string> = {
  'Properties': 'lease',
  'Units': 'lease',
  'Landlords': 'lease',
  'Lease Contracts': 'lease',
  'Tenants': 'tenant',
  'Customers': 'customer',
  'Rent-A-Car': 'rent-a-car',
  'Car Sales': 'car-sales',
  'Finance': 'finance',
  'Products & Services': 'products',
  'Vaults & Stores': 'stores',
  'Asset Management': 'asset-management',
  'Maintenance': 'maintenance',
  'Project Management': 'project-management',
  'Workflow': 'workflow',
  'Data Processing': 'data-processing',
  'Utilities': 'utilities',
  'User Management': 'settings',
  'Settings': 'settings',
};


export const AuthorizationProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
    const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({});
    const [userRole, setUserRole] = useState<UserRole['role'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPermissions = async () => {
            setIsLoading(true);
            try {
                const storedProfile = sessionStorage.getItem('userProfile');
                if (storedProfile) {
                    const profile = JSON.parse(storedProfile);
                    setUserRole(profile.role);
                }
                
                const accessData = await getCombinedAccessControlData();
                if (accessData.success) {
                    setPermissions(accessData.permissions || []);
                    setModuleSettings(accessData.moduleSettings || {});
                } else {
                     console.error("Failed to load access control data:", accessData.error);
                }
            } catch (error) {
                 console.error("Error loading access control data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPermissions();
    }, []);

    const can = useCallback((feature: string, action: string): boolean => {
        if (isLoading) return false;
        if (userRole === 'Super Admin') return true;
        if (!userRole) return false;

        const featurePermission = permissions.find(p => p.feature === feature);
        if (!featurePermission) return false;

        const actionPermission = featurePermission.actions.find(a => a.action === action);
        if (!actionPermission) return false;

        return actionPermission.allowedRoles.includes(userRole);
    }, [permissions, userRole, isLoading]);
    
    const isModuleEnabled = useCallback((moduleId: string): boolean => {
        if (isLoading) return false;
        if (userRole === 'Super Admin' || userRole === 'Developer') return true;

        const isGloballyEnabled = moduleSettings[moduleId]?.enabled ?? false;
        if (!isGloballyEnabled) {
            return false;
        }

        // Find all features associated with this module
        const featuresInModule = Object.keys(featureToModuleMap).filter(
            feature => featureToModuleMap[feature] === moduleId
        );
        
        if (featuresInModule.length === 0) {
            return true; // No specific permissions tied, so allow if globally enabled
        }

        // Check if the user has permission for at least one action in any of the module's features
        return featuresInModule.some(featureName => {
            const featurePermission = permissions.find(p => p.feature === featureName);
            if (!featurePermission) return false;
            return featurePermission.actions.some(action => 
                action.allowedRoles.includes(userRole!)
            );
        });

    }, [moduleSettings, permissions, userRole, isLoading]);

    const value = { can, isModuleEnabled, isLoading, userRole };
    
    return (
        <AuthorizationContext.Provider value={value}>
            {isLoading ? (
                 <div className="flex h-screen w-full items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading Permissions...</span>
                    </div>
                </div>
            ) : children}
        </AuthorizationContext.Provider>
    );
};

export const useAuthorization = () => {
  const context = useContext(AuthorizationContext);
  if (context === undefined) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
};
