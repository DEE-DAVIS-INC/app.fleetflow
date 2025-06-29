'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Viewer';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Default admin user (in a real app, this would come from authentication)
  const [user, setUser] = useState<User | null>({
    id: 'U001',
    name: 'Fleet Manager',
    email: 'manager@fleetflow.com',
    role: 'Admin',
    permissions: ['all']
  });

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('fleetflow-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleetflow-user');
  };

  return (
    <AuthContext.Provider value={{ user, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher-order component for protecting routes
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  fallback 
}) => {
  const { hasPermission } = useAuth();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">You don't have permission to access this feature.</p>
        <p className="text-sm text-red-500 mt-2">
          Required permission: <code className="bg-red-100 px-2 py-1 rounded">{requiredPermission}</code>
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
