// Access Control Configuration
// In a production app, this would be managed by your authentication/authorization system

export interface UserPermissions {
  hasManagementAccess: boolean;
  hasAnalyticsAccess: boolean;
  hasFinancialsAccess: boolean;
  hasAdminAccess: boolean;
}

// Mock user roles - in production, this would come from your auth provider
export const USER_ROLES = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
  MANAGER: 'manager',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Current user simulation - in production, this would come from your auth context
export const getCurrentUser = (): { role: UserRole; permissions: UserPermissions; brokerId?: string } => {
  // Change this value to test different access levels:
  // 'driver' | 'dispatcher' | 'broker' | 'manager' | 'admin'
  const currentUserRole = 'admin' as UserRole; // Set to 'broker' to test broker access
  
  const permissions: UserPermissions = {
    hasManagementAccess: ['manager', 'admin'].includes(currentUserRole),
    hasAnalyticsAccess: ['manager', 'admin'].includes(currentUserRole),
    hasFinancialsAccess: ['manager', 'admin'].includes(currentUserRole),
    hasAdminAccess: currentUserRole === 'admin'
  };
  
  return {
    role: currentUserRole,
    permissions,
    brokerId: currentUserRole === 'broker' ? 'broker-001' : undefined // Mock broker ID
  };
};

// Helper function to check specific permissions
export const checkPermission = (requiredPermission: keyof UserPermissions): boolean => {
  const { permissions } = getCurrentUser();
  return permissions[requiredPermission];
};

// Role-based access control messages
export const ACCESS_MESSAGES = {
  analytics: {
    title: 'Fleet Analytics Access Restricted',
    message: 'This section contains sensitive performance metrics and business intelligence data.',
    requirement: 'Manager or Admin access required'
  },
  financials: {
    title: 'Financial Management Access Restricted', 
    message: 'This section contains sensitive financial information including invoices, expenses, and revenue data.',
    requirement: 'Manager or Admin access required'
  },
  admin: {
    title: 'Administrative Access Restricted',
    message: 'This section contains system-wide settings and user management capabilities.',
    requirement: 'Admin access required'
  }
} as const;
