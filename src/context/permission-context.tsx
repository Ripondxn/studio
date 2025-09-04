
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCombinedAccessControlData, type UserOverride } from '@/app/admin/access-control/actions';
import { type ModuleSettings } from '@/app/admin/access-control/schema';
import { type FeaturePermission } from '@/app/admin/access-control/permissions';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { usePathname } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole['role'];
}

interface AuthorizationContextType {
  userRole: UserRole['role'] | null;
  can: (action: string, feature: string) => boolean;
  isModuleEnabled: (moduleId: string) => boolean;
  isLoading: boolean;
  profile: UserProfile | null;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

export function AuthorizationProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({});
  const [userOverrides, setUserOverrides] = useState<UserOverride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const userProfileStr = sessionStorage.getItem('userProfile');
    if (userProfileStr) {
      const parsedProfile = JSON.parse(userProfileStr) as UserProfile;
      setProfile(parsedProfile);
    } else {
      setIsLoading(false);
    }
  }, [pathname]); // Rerun on path change to ensure profile is loaded

  useEffect(() => {
    if (profile) {
      setIsLoading(true);
      getCombinedAccessControlData()
        .then(data => {
          if (data.success) {
            setPermissions(data.permissions || []);
            setModuleSettings(data.moduleSettings || {});
            setUserOverrides(data.userOverrides || []);
          } else {
            console.error("Failed to load access control data:", data.error);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  const isModuleEnabled = useCallback((moduleId: string): boolean => {
    if (isLoading) return false; // Don't allow access while loading
    const module = moduleSettings[moduleId];
    return module ? module.enabled : true; // Default to enabled if not in settings
  }, [moduleSettings, isLoading]);

  const can = useCallback((action: string, feature: string): boolean => {
    if (isLoading || !profile) return false;
    if (profile.role === 'Super Admin') return true;

    const featureId = feature.toLowerCase().replace(/\s/g, '_');
    
    // 1. Check Module-level enable/disable state
    if (!isModuleEnabled(featureId)) return false;

    // 2. Check User-specific overrides
    const userOverride = userOverrides.find(o => o.email === profile.email);
    if (userOverride) {
      if(userOverride.allowedModules.includes('all_modules') || userOverride.allowedModules.includes(featureId)) {
          // If an override exists, it grants blanket access to the module's features for now.
          // A more granular check could be implemented here if overrides become more detailed.
          return true;
      }
    }

    // 3. Check Role-based permissions
    const featurePermission = permissions.find(p => p.feature.toLowerCase().replace(/\s/g, '_') === featureId);
    if (!featurePermission) return false; 

    const actionPermission = featurePermission.actions.find(a => a.action === action);
    if (!actionPermission) return false;

    return actionPermission.allowedRoles.includes(profile.role);

  }, [profile, permissions, moduleSettings, userOverrides, isLoading, isModuleEnabled]);

  return (
    <AuthorizationContext.Provider value={{ userRole: profile?.role ?? null, can, isModuleEnabled, isLoading, profile }}>
      {children}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorization() {
  const context = useContext(AuthorizationContext);
  if (context === undefined) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
}
