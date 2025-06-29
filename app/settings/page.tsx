'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../components/AuthProvider';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'Core' | 'Financial' | 'Reports' | 'Admin';
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'general'>('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Current user context
  const [currentUser] = useState<User>({
    id: 'U001',
    name: 'Fleet Manager',
    email: 'manager@fleetflow.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Current session',
    permissions: ['all'],
    createdDate: '2024-01-01'
  });

  // Available permissions
  const [permissions] = useState<Permission[]>([
    { id: 'dashboard_view', name: 'View Dashboard', description: 'Access to main dashboard and metrics', category: 'Core' },
    { id: 'vehicles_manage', name: 'Manage Vehicles', description: 'Add, edit, and delete vehicles', category: 'Core' },
    { id: 'drivers_manage', name: 'Manage Drivers', description: 'Add, edit, and delete driver profiles', category: 'Core' },
    { id: 'routes_manage', name: 'Manage Routes', description: 'Create and modify routes', category: 'Core' },
    { id: 'dispatch_access', name: 'Dispatch Central', description: 'Access dispatch operations and load assignment', category: 'Core' },
    { id: 'broker_access', name: 'Broker Box', description: 'Access freight brokerage features', category: 'Core' },
    { id: 'quoting_access', name: 'Freight Quoting', description: 'Generate and manage freight quotes', category: 'Core' },
    { id: 'maintenance_manage', name: 'Maintenance Management', description: 'Schedule and track vehicle maintenance', category: 'Core' },
    { id: 'invoices_view', name: 'View Invoices', description: 'View dispatch invoices and billing', category: 'Financial' },
    { id: 'invoices_manage', name: 'Manage Invoices', description: 'Create, edit, and manage invoices', category: 'Financial' },
    { id: 'financial_reports', name: 'Financial Reports', description: 'Access financial reporting and analytics', category: 'Financial' },
    { id: 'reports_view', name: 'View Reports', description: 'Access standard reports', category: 'Reports' },
    { id: 'reports_export', name: 'Export Reports', description: 'Download and export report data', category: 'Reports' },
    { id: 'users_manage', name: 'Manage Users', description: 'Create, edit, and delete user accounts', category: 'Admin' },
    { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration', category: 'Admin' }
  ]);

  // Sample users
  const [users, setUsers] = useState<User[]>([
    {
      id: 'U001',
      name: 'Fleet Manager',
      email: 'manager@fleetflow.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: 'Current session',
      permissions: ['all'],
      createdDate: '2024-01-01'
    },
    {
      id: 'U002',
      name: 'John Smith',
      email: 'john.smith@fleetflow.com',
      role: 'Driver',
      status: 'Active',
      lastLogin: '2024-12-19 14:30',
      permissions: ['dashboard_view', 'routes_manage'],
      createdDate: '2024-03-15'
    },
    {
      id: 'U003',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@fleetflow.com',
      role: 'Dispatcher',
      status: 'Active',
      lastLogin: '2024-12-19 16:45',
      permissions: ['dashboard_view', 'dispatch_access', 'routes_manage', 'drivers_manage'],
      createdDate: '2024-02-10'
    },
    {
      id: 'U004',
      name: 'Mike Wilson',
      email: 'mike.wilson@fleetflow.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-12-19 12:15',
      permissions: ['dashboard_view', 'vehicles_manage', 'drivers_manage', 'reports_view', 'invoices_view'],
      createdDate: '2024-01-20'
    }
  ]);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Viewer' as User['role'],
    permissions: [] as string[]
  });

  const rolePermissions = {
    'Admin': ['all'],
    'Manager': ['dashboard_view', 'vehicles_manage', 'drivers_manage', 'routes_manage', 'maintenance_manage', 'reports_view', 'invoices_view', 'financial_reports'],
    'Dispatcher': ['dashboard_view', 'dispatch_access', 'routes_manage', 'drivers_manage', 'invoices_view'],
    'Driver': ['dashboard_view', 'routes_manage'],
    'Viewer': ['dashboard_view', 'reports_view']
  };

  const createUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: `U${(users.length + 1).toString().padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      lastLogin: 'Never',
      permissions: newUser.role === 'Admin' ? ['all'] : rolePermissions[newUser.role],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Viewer', permissions: [] });
    setShowCreateUser(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Cannot delete your own account');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Dispatcher': return 'bg-green-100 text-green-800';
      case 'Driver': return 'bg-yellow-100 text-yellow-800';
      case 'Viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  return (
    <ProtectedRoute requiredPermission="users_manage">
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage users, permissions, and system configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'users', label: 'User Management', count: users.length },
            { id: 'permissions', label: 'Permissions', count: permissions.length },
            { id: 'general', label: 'General Settings', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">User Accounts</h2>
            <button
              onClick={() => setShowCreateUser(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Create New User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">System Permissions</h2>
          
          {['Core', 'Financial', 'Reports', 'Admin'].map((category) => (
            <div key={category} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{category} Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getPermissionsByCategory(category).map((permission) => (
                  <div key={permission.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                      </div>
                      <span className="text-xs text-gray-400">ID: {permission.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue="FleetFlow Transportation"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue="contact@fleetflow.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Fee Percentage</label>
                <input
                  type="number"
                  defaultValue="10"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Current: 10% of load value</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms (Days)</label>
                <input
                  type="number"
                  defaultValue="2"
                  min="1"
                  max="30"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Current: 2 days (Monday to Wednesday)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Driver">Driver</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Permissions will be assigned based on role
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateUser(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit User: {selectedUser.name}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedUser.permissions.includes('all') ? (
                      <div className="text-sm text-green-600 font-medium">
                        👑 Admin - All Permissions Granted
                      </div>
                    ) : (
                      permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedUser.permissions.includes(permission.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                          <span className="text-sm text-gray-700">{permission.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
