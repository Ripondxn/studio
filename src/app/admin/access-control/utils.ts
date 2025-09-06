
import { type User } from 'next-auth';
import { type Permission } from './schema';

export const hasPermission = (user: User | undefined, requiredPermission: string, permissions: Permission[]) => {
    if (!user || !user.role) return false;

    const [module, action] = requiredPermission.split('.');
    const permission = permissions.find(p => p.moduleId === module);

    if (!permission) return false;

    if (Array.isArray(user.role)) {
        return user.role.some(role => permission.permissions.some(p => p.role === role && p.actions.includes(action)));
    } else {
        return permission.permissions.some(p => p.role === user.role && p.actions.includes(action));
    }
};
