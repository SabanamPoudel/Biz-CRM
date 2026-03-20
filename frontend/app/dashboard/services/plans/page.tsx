"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  yearlyDiscountPercent: number;
  companyTypeId: number | null;
  companyType?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  planServices: Array<{
    service: {
      id: number;
      name: string;
      type: string;
      features: Array<{
        name: string;
        description: string | null;
      }>;
    };
  }>;
  _count?: {
    companies: number;
  };
}

interface CompanyType {
  id: number;
  name: string;
  slug: string;
}

interface Service {
  id: number;
  name: string;
  type: string;
  features: Array<{
    name: string;
  }>;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "BASE" as "BASE" | "ADDON",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    yearlyDiscountPercent: 20,
    companyTypeId: null as number | null,
    isPopular: false,
    isActive: true,
    sortOrder: 0,
    services: [] as number[],
  });

  useEffect(() => {
    Promise.all([fetchPlans(), fetchServices(), fetchCompanyTypes()]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      setPlans(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCompanyTypes = async () => {
    try {
      const response = await fetch("/api/company-types");
      if (!response.ok) throw new Error("Failed to fetch company types");
      const data = await response.json();
      setCompanyTypes(data);
    } catch (error) {
      console.error("Error fetching company types:", error);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      type: "BASE" as "BASE" | "ADDON",
      monthlyPriceCents: 0,
      yearlyPriceCents: 0,
      yearlyDiscountPercent: 20,
      companyTypeId: null,
      isPopular: false,
      isActive: true,
      sortOrder: plans.length,
      services: [],
    });
    setShowAddModal(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      type: plan.type as "BASE" | "ADDON",
      monthlyPriceCents: plan.monthlyPriceCents,
      yearlyPriceCents: plan.yearlyPriceCents,
      yearlyDiscountPercent: plan.yearlyDiscountPercent,
      companyTypeId: plan.companyTypeId,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
      services: plan.planServices.map(ps => ps.service.id),
    });
    setShowEditModal(true);
  };

  const handleManageServices = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      ...formData,
      services: plan.planServices.map(ps => ps.service.id),
    });
    setShowServicesModal(true);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (showEditModal && selectedPlan) {
        response = await fetch(`/api/plans/${selectedPlan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        fetchPlans();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPlan(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save plan");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Error saving plan");
    }
  };

  const handleSaveServices = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) return;

    try {
      const response = await fetch(`/api/plans/${selectedPlan.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceIds: formData.services }),
      });

      if (response.ok) {
        fetchPlans();
        setShowServicesModal(false);
        setSelectedPlan(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save services");
      }
    } catch (error) {
      console.error("Error saving services:", error);
      alert("Error saving services");
    }
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;

    try {
      const response = await fetch(`/api/plans/${selectedPlan.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPlans();
        setShowDeleteConfirm(false);
        setSelectedPlan(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Error deleting plan");
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full px-8 py-12">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003174] to-[#0052a8] bg-clip-text text-transparent mb-2">
                Plans & Pricing
              </h1>
              <p className="text-gray-600">Manage your subscription plans and pricing tiers</p>
            </div>
            <Link
              href="/dashboard/services/company-types"
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[#003174] hover:bg-gray-50 hover:border-[#003174] transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">Company Types</span>
            </Link>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPlans}
                className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors group"
                title="Refresh"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#003174] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent w-80 text-sm transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-[#003174] to-[#0052a8] text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Plan</span>
            </button>
          </div>
        </div>

        {/* Modern Table Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Plan Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service Types</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Related to</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">No plans found</h3>
                          <p className="text-gray-500 mb-4">Get started by creating your first plan</p>
                          <button
                            onClick={handleAdd}
                            className="bg-gradient-to-r from-[#003174] to-[#0052a8] text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium inline-flex items-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Create First Plan</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200 group">
                      {/* Plan Details */}
                      <td className="px-6 py-10">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#003174] to-[#0052a8] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {plan.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-bold text-gray-900">{plan.name}</div>
                              {plan.isPopular && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  ⭐ Popular
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{plan.slug}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-10 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                          plan.type === 'ADDON' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {plan.type === 'ADDON' ? '✨ Add-on' : '⭐ Base'}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-10 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-lg font-bold text-gray-900">${(plan.monthlyPriceCents / 100).toFixed(0)}</span>
                            <span className="text-xs text-gray-500">/mo</span>
                          </div>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-sm font-semibold text-gray-600">${(plan.yearlyPriceCents / 100).toFixed(0)}</span>
                            <span className="text-xs text-gray-400">/yr</span>
                          </div>
                        </div>
                      </td>

                      {/* Service Types */}
                      <td className="px-6 py-10">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {plan.planServices && plan.planServices.length > 0 ? (
                            plan.planServices.map((ps, idx) => (
                              <span 
                                key={idx} 
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  ps.service.type === 'BASE'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                    : 'bg-purple-50 text-purple-700 border border-purple-100'
                                }`}
                              >
                                {ps.service.type}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">None</span>
                          )}
                        </div>
                      </td>

                      {/* Related to */}
                      <td className="px-6 py-10 whitespace-nowrap">
                        {plan.companyType ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                            {plan.companyType.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">All Types</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-10 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                          plan.isActive 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${plan.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-10 whitespace-nowrap text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === plan.id ? null : plan.id)}
                            className="p-2 hover:bg-gradient-to-r hover:from-[#003174] hover:to-[#0052a8] hover:text-white rounded-xl transition-all duration-200 group/btn"
                          >
                            <svg className="w-5 h-5 text-gray-600 group-hover/btn:text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>

                          {openMenuId === plan.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                              <div className="py-1.5">
                                <button
                                  onClick={() => {
                                    handleManageServices(plan);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">Manage Services</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleEdit(plan);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center space-x-3 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">Edit Plan</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(plan);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">Delete Plan</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#003174] to-[#0052a8] px-8 py-6 text-white rounded-t-3xl">
              <h2 className="text-3xl font-bold">
                {showEditModal ? "Edit Plan" : "Create New Plan"}
              </h2>
              <p className="text-white/80 mt-1">
                {showEditModal ? "Update plan details and pricing" : "Configure your new subscription plan"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Name & Slug */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all"
                      placeholder="e.g., Professional Plan"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all"
                      placeholder="professional-plan"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all resize-none"
                    placeholder="Describe what this plan includes..."
                  />
                </div>

                {/* Company Type & Plan Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Type</label>
                    <select
                      value={formData.companyTypeId || ""}
                      onChange={(e) => setFormData({ ...formData, companyTypeId: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">All Company Types</option>
                      {companyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "BASE" | "ADDON" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                      required
                    >
                      <option value="BASE">⭐ Base Plan</option>
                      <option value="ADDON">✨ Add-on</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pricing Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Price *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={(formData.monthlyPriceCents / 100).toFixed(2)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData({ 
                              ...formData, 
                              monthlyPriceCents: isNaN(value) ? 0 : Math.round(value * 100) 
                            });
                          }}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Yearly Price *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={(formData.yearlyPriceCents / 100).toFixed(2)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData({ 
                              ...formData, 
                              yearlyPriceCents: isNaN(value) ? 0 : Math.round(value * 100) 
                            });
                          }}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.yearlyDiscountPercent}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setFormData({ 
                              ...formData, 
                              yearlyDiscountPercent: isNaN(value) ? 20 : value 
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                          placeholder="20"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-500 font-medium">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Plan Settings</span>
                  </h3>

                  <div className="flex items-center space-x-6 mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-yellow-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">⭐ Mark as Popular</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">● Active Status</span>
                    </label>
                  </div>

                  <div className="w-48">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent transition-all bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedPlan(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#003174] to-[#0052a8] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{showEditModal ? "Save Changes" : "Create Plan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Services Modal */}
      {showServicesModal && selectedPlan && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex justify-center">
          <div className="bg-white shadow-2xl max-w-3xl w-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manage Services - {selectedPlan.name}
              </h2>
              <form onSubmit={handleSaveServices}>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, services: [...formData.services, service.id] });
                            } else {
                              setFormData({ ...formData, services: formData.services.filter(id => id !== service.id) });
                            }
                          }}
                          className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.type === "BASE" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                            }`}>
                              {service.type}
                            </span>
                          </div>
                          {service.features.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {service.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="text-xs text-gray-600">• {feature.name}</li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-xs text-gray-500">+ {service.features.length - 3} more</li>
                              )}
                            </ul>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowServicesModal(false);
                      setSelectedPlan(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052a8]"
                  >
                    Save Services
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedPlan && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedPlan.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
