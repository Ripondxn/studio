
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

export const AuthorizationProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
    const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({});
    const [userRole, setUserRole] = useState<UserRole['role'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPermissions = async () => {
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
        if(isLoading) return false;
        if(userRole === 'Super Admin' || userRole === 'Developer') return true;
        return moduleSettings[moduleId]?.enabled ?? true;
    }, [moduleSettings, isLoading, userRole]);

    const value = { can, isModuleEnabled, isLoading, userRole };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading Permissions...</span>
                </div>
            </div>
        );
    }
    
    return (
        <AuthorizationContext.Provider value={value}>
            {children}
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
