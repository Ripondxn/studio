
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { type FeaturePermission } from '@/app/admin/access-control/permissions';
import { type ModuleSettings } from '@/app/admin/access-control/schema';
import { getCombinedAccessControlData } from '@/app/admin/access-control/actions';

interface AuthorizationContextType {
  isModuleEnabled: (moduleId: string) => boolean;
  can: (feature: string, action: string) => boolean;
  isLoading: boolean;
  isAuthorized: (feature: string, action: string) => boolean;
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
                
                const result = await getCombinedAccessControlData();
                if (result.success) {
                    setPermissions(result.permissions || []);
                    setModuleSettings(result.moduleSettings || {});
                } else {
                    console.error("Failed to load access control data:", result.error);
                }
            } catch (error) {
                 console.error("Error loading access control data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPermissions();
    }, []);

    const isModuleEnabled = useCallback((moduleId: string): boolean => {
        if (isLoading) return false; // Or true, depending on default behavior
        // If a module isn't in the settings file, assume it's enabled.
        return moduleSettings[moduleId]?.enabled ?? true;
    }, [moduleSettings, isLoading]);

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
    
    // Alias for `can` for semantic clarity in some components
    const isAuthorized = can;

    const value = { isModuleEnabled, can, isLoading, isAuthorized, userRole };

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
