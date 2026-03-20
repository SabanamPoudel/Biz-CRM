'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api-config';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
  };
  plan?: {
    name: string;
    price: number;
  };
  status: 'active' | 'inactive' | 'pending';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        // Mock data for demonstration
        setUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            createdAt: '2025-06-15',
            company: { id: '1', name: 'Tech Startup Inc' },
            plan: { name: 'Premium', price: 99 },
            status: 'active'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 (555) 234-5678',
            createdAt: '2025-07-20',
            company: { id: '2', name: 'Digital Solutions LLC' },
            plan: { name: 'Starter', price: 29 },
            status: 'active'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '+1 (555) 345-6789',
            createdAt: '2025-08-10',
            company: { id: '3', name: 'Creative Agency Co' },
            plan: { name: 'Pro', price: 199 },
            status: 'pending'
          },
          {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            phone: '+1 (555) 456-7890',
            createdAt: '2025-05-22',
            company: { id: '4', name: 'Innovation Labs' },
            plan: { name: 'Premium', price: 99 },
            status: 'active'
          },
          {
            id: '5',
            name: 'Robert Brown',
            email: 'robert@example.com',
            phone: '+1 (555) 567-8901',
            createdAt: '2025-04-18',
            company: undefined,
            plan: undefined,
            status: 'inactive'
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const toggleMenu = (userId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'inactive':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#003174] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#003174] to-[#0052a8] bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-600 text-lg">
          View and manage all registered users, their companies, and subscription status
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003174] bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchUsers}
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-2">No users found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-8 py-4 border-b border-gray-200 grid grid-cols-12 gap-4 sticky top-0">
            <div className="col-span-3">
              <p className="text-sm font-semibold text-gray-900">User Details</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-900">Company</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-900">Plan</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-900">Status</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-900">Joined</p>
            </div>
            <div className="col-span-1 text-right">
              <p className="text-sm font-semibold text-gray-900">Actions</p>
            </div>
          </div>

          {/* Table Rows */}
          {filteredUsers.map((user) => (
            <div key={user.id} className="border-b border-gray-200 hover:from-blue-50/30 hover:to-indigo-50/20 transition-colors">
              <div className="px-8 py-6 grid grid-cols-12 gap-4 items-center">
                {/* User Details */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#003174] to-[#0052a8] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="col-span-2">
                  {user.company ? (
                    <div>
                      <p className="font-medium text-gray-900">{user.company.name}</p>
                      <p className="text-sm text-gray-500">ID: {user.company.id}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No company</span>
                  )}
                </div>

                {/* Plan */}
                <div className="col-span-2">
                  {user.plan ? (
                    <div>
                      <p className="font-medium text-gray-900">{user.plan.name}</p>
                      <p className="text-sm text-gray-500">${user.plan.price}/mo</p>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No plan</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>

                {/* Joined Date */}
                <div className="col-span-2">
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Action Menu */}
                <div className="col-span-1 text-right relative">
                  <button
                    onClick={() => toggleMenu(user.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>

                  {expandedMenus[user.id] && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 border-b border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        View Details
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 border-b border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit User
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => setShowDeleteConfirm(user.id)}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete User?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The user and all associated data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
