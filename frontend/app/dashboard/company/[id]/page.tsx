"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_URL } from "@/lib/api-config";
import { TasksTab, DocumentsTab, TaxFilingsTab, NotesTab } from "@/components/CompanyDetailTabs";

export default function CompanyDetailPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('user-details');
  const router = useRouter();
  const params = useParams();
  const companyId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchCompanyDetails(token);
  }, [companyId]);

  const fetchCompanyDetails = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company details");
      }

      const user = await response.json();
      
      const companyData = {
        id: user.id,
        companyName: user.companyName || "N/A",
        userName: user.name || user.email,
        email: user.email,
        phone: user.phone || "N/A",
        state: user.selectedState || "N/A",
        country: user.country || "N/A",
        package: user.selectedPlan || "N/A",
        dateCreated: new Date(user.createdAt),
        status: user.onboardingComplete ? "active" : "pending",
        businessType: user.businessType || "N/A",
        ownershipData: user.ownershipData,
      };

      setCompany(companyData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company details:", error);
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const tabs = [
    { id: 'user-details', name: 'User Details', icon: '👤' },
    { id: 'company-info', name: 'Company Info', icon: '🏢' },
    { id: 'tasks', name: 'Tasks', icon: '✓' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'tax-filings', name: 'Tax Filings', icon: '💰' },
    { id: 'billing', name: 'Billing Details', icon: '💳' },
    { id: 'subscription', name: 'Subscription', icon: '⭐' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'activity-log', name: 'Activity Log', icon: '📊' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
        <div className="text-center">
          <p className="text-gray-600">Company not found</p>
          <button
            onClick={() => router.push('/dashboard/company')}
            className="mt-4 px-6 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/company')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-[#003174]">#{companyId}</h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    company.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {company.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{company.companyName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium">
                🔄 Convert to Customer
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                ✏️ Edit
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-t-lg font-medium text-sm transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-[#e7edfc] text-[#003174] border-b-2 border-[#003174]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'user-details' && <UserDetailsTab company={company} formatDate={formatDate} />}
        {activeTab === 'company-info' && <CompanyInfoTab company={company} />}
        {activeTab === 'tasks' && <TasksTab company={company} />}
        {activeTab === 'documents' && <DocumentsTab company={company} />}
        {activeTab === 'tax-filings' && <TaxFilingsTab company={company} />}
        {activeTab === 'billing' && <BillingTab company={company} />}
        {activeTab === 'subscription' && <SubscriptionTab company={company} formatDate={formatDate} />}
        {activeTab === 'notes' && <NotesTab company={company} />}
        {activeTab === 'activity-log' && <ActivityLogTab company={company} formatDate={formatDate} />}
      </div>
    </div>
  );
}

// User Details Tab
function UserDetailsTab({ company, formatDate }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#003174] mb-4 flex items-center">
            <span className="mr-2">📋</span> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{company.userName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900">{company.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-gray-900">{company.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
              <p className="text-gray-900">{company.country}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
              <p className="text-gray-900">{company.state}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
              <p className="text-gray-900">{formatDate(company.dateCreated)}</p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#003174] mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Account Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600 mt-1">Account Status</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{company.package}</div>
              <div className="text-sm text-gray-600 mt-1">Current Plan</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">✓</div>
              <div className="text-sm text-gray-600 mt-1">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#003174] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-[#e7edfc] text-[#003174] rounded-lg hover:bg-[#d0ddfa] transition-colors text-sm font-medium">
              📧 Send Email
            </button>
            <button className="w-full px-4 py-2 bg-[#e7edfc] text-[#003174] rounded-lg hover:bg-[#d0ddfa] transition-colors text-sm font-medium">
              📞 Call User
            </button>
            <button className="w-full px-4 py-2 bg-[#e7edfc] text-[#003174] rounded-lg hover:bg-[#d0ddfa] transition-colors text-sm font-medium">
              📝 Add Note
            </button>
            <button className="w-full px-4 py-2 bg-[#c51111] text-white rounded-lg hover:bg-[#a00e0e] transition-colors text-sm font-medium">
              🗑️ Delete Account
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-br from-[#003174] to-[#0052b4] rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-bold mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-100">Total Tasks</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Documents</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Notes</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Activities</span>
              <span className="font-bold">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Company Info Tab
function CompanyInfoTab({ company }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[#003174] mb-4 flex items-center">
          <span className="mr-2">🏢</span> Company Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
            <p className="text-gray-900 font-medium text-lg">{company.companyName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
              <p className="text-gray-900">{company.businessType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
              <p className="text-gray-900">{company.state}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Industry</label>
            <p className="text-gray-900">Business Services</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Registration Status</label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              ✓ Registered
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[#003174] mb-4 flex items-center">
          <span className="mr-2">📍</span> Business Address
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
            <p className="text-gray-900">{company.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">State/Province</label>
            <p className="text-gray-900">{company.state}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Zip Code</label>
            <p className="text-gray-900">-</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-gradient-to-r from-[#e7edfc] to-[#d0ddfa] rounded-xl shadow-sm border border-[#003174] border-opacity-20 p-6">
        <h3 className="text-lg font-bold text-[#003174] mb-4">🎯 Formation Progress</h3>
        <div className="space-y-3">
          {['Order Processed', 'Company Profile Created', 'Formation Filed', 'Documents Generated'].map((step, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                idx < 3 ? 'bg-green-500 text-white' : 'bg-white text-gray-400'
              }`}>
                {idx < 3 ? '✓' : idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{step}</div>
                <div className="text-sm text-gray-600">{idx < 3 ? 'Completed' : 'Pending'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Billing Tab
function BillingTab({ company }: any) {
  const invoices: any[] = []; // Real invoices from database

  return (
    <div className="space-y-6">
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-[#e7edfc] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Billing Records Yet</h3>
          <p className="text-gray-600 mb-6">Invoices and payment history will appear here</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-2">Total Billed</div>
              <div className="text-3xl font-bold text-[#003174]">${invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)}</div>
              <div className="text-xs text-gray-600 mt-1">All time</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-2">Outstanding</div>
              <div className="text-3xl font-bold text-[#c51111]">${invoices.filter((i: any) => i.status !== 'Paid').reduce((sum: number, inv: any) => sum + inv.amount, 0)}</div>
              <div className="text-xs text-green-600 mt-1">✓ Paid up</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-2">Total Invoices</div>
              <div className="text-3xl font-bold text-gray-900">{invoices.length}</div>
              <div className="text-xs text-gray-600 mt-1">Issued</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-[#003174] mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e7edfc]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-6 py-4 text-gray-700">{invoice.date}</td>
                      <td className="px-6 py-4 font-semibold text-[#003174]">${invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#003174] hover:text-[#0052b4] font-medium text-sm">Download PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Subscription Tab
function SubscriptionTab({ company, formatDate }: any) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/payment');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#003174] to-[#0052b4] rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-90 mb-2">Current Plan</div>
            <h2 className="text-3xl font-bold mb-4">{company.package} Plan</h2>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">$299</span>
              <span className="text-lg opacity-90">/year</span>
            </div>
          </div>
          <div className="text-6xl opacity-20">⭐</div>
        </div>
        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Next Billing Date</div>
              <div className="font-semibold">February 28, 2026</div>
            </div>
            <button
              onClick={handleUpgrade}
              className="px-6 py-2 bg-white text-[#003174] rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Basic', price: '$99', features: ['Company Formation', 'EIN Filing', 'Basic Support'] },
          { name: 'Professional', price: '$299', features: ['Everything in Basic', 'Tax Filing', 'Priority Support', 'Compliance Tracking'], current: true },
          { name: 'Enterprise', price: '$599', features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom Solutions', '24/7 Support'] },
        ].map((plan, idx) => (
          <div key={idx} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
            plan.current ? 'border-[#003174]' : 'border-gray-200'
          }`}>
            {plan.current && (
              <div className="inline-block bg-[#003174] text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Current Plan
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold text-[#003174] mb-4">{plan.price}<span className="text-sm text-gray-600">/year</span></div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-start text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={plan.current ? undefined : handleUpgrade}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                plan.current
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#003174] text-white hover:bg-[#0052b4]'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Activity Log Tab
function ActivityLogTab({ company, formatDate }: any) {
  const activities = [
    { id: 1, action: 'Company record created', user: 'System', time: formatDate(company.dateCreated), type: 'status' },
  ]; // Real activity logs from database

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update': return '✏️';
      case 'document': return '📄';
      case 'payment': return '💳';
      case 'communication': return '📧';
      case 'task': return '✓';
      case 'status': return '🔄';
      default: return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'communication': return 'bg-yellow-100 text-yellow-800';
      case 'task': return 'bg-indigo-100 text-indigo-800';
      case 'status': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[#003174] mb-6">Recent Activities</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                </div>
                
                {/* Activity content */}
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 mt-1">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#e7edfc] to-[#d0ddfa] rounded-xl shadow-sm border border-[#003174] border-opacity-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[#003174] mb-1">Activity Summary</h4>
            <p className="text-sm text-gray-600">Total activities in the last 30 days</p>
          </div>
          <div className="text-4xl font-bold text-[#003174]">24</div>
        </div>
      </div>
    </div>
  );
}
