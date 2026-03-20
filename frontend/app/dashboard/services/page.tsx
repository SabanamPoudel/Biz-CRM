"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: "BASE" | "ADDON";
  billingInterval: "ONE_TIME" | "MONTHLY" | "YEARLY";
  isActive: boolean;
  sortOrder: number;
  features: Array<{
    id: number;
    name: string;
    description: string | null;
    sortOrder: number;
  }>;
  categories: Array<{
    category: {
      id: number;
      name: string;
    };
  }>;
  pricing: Array<{
    id: number;
    priceCents: number;
    companyType: {
      id: number;
      name: string;
    };
  }>;
  _count?: {
    planServices: number;
  };
}

interface Category {
  id: number;
  name: string;
}

interface CompanyType {
  id: number;
  name: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "BASE" as "BASE" | "ADDON",
    billingInterval: "MONTHLY" as "ONE_TIME" | "MONTHLY" | "YEARLY",
    features: [{ name: "", description: "", sortOrder: 0 }],
    categories: [] as number[],
    pricing: [] as Array<{ companyTypeId: number; priceCents: number }>,
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchServices(),
      fetchCategories(),
      fetchCompanyTypes(),
    ]);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    const pricing = companyTypes.map(ct => ({
      companyTypeId: ct.id,
      priceCents: 0,
    }));

    setFormData({
      name: "",
      slug: "",
      description: "",
      type: "BASE",
      billingInterval: "MONTHLY",
      features: [{ name: "", description: "", sortOrder: 0 }],
      categories: [],
      pricing,
      isActive: true,
      sortOrder: services.length,
    });
    setShowAddModal(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      type: service.type,
      billingInterval: service.billingInterval,
      features:
        service.features.length > 0
          ? service.features.map(f => ({
              name: f.name,
              description: f.description ?? "",
              sortOrder: f.sortOrder
            }))
          : [{ name: "", description: "", sortOrder: 0 }],
      categories: service.categories.map(c => c.category.id),
      pricing: service.pricing.map(p => ({
        companyTypeId: p.companyType.id,
        priceCents: p.priceCents,
      })),
      isActive: service.isActive,
      sortOrder: service.sortOrder,
    });
    setShowEditModal(true);
  };

  const handleManagePricing = (service: Service) => {
    setSelectedService(service);
    const pricing = companyTypes.map(ct => {
      const existing = service.pricing.find(p => p.companyType.id === ct.id);
      return {
        companyTypeId: ct.id,
        priceCents: existing?.priceCents || 0,
      };
    });
    setFormData({ ...formData, pricing });
    setShowPricingModal(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.name.trim() !== ""),
      };

      let response;
      if (showEditModal && selectedService) {
        response = await fetch(`/api/services/${selectedService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        fetchServices();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedService(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    try {
      const response = await fetch(`/api/services/${selectedService.id}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing: formData.pricing }),
      });

      if (response.ok) {
        fetchServices();
        setShowPricingModal(false);
        setSelectedService(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save pricing");
      }
    } catch (error) {
      console.error("Error saving pricing:", error);
      alert("Error saving pricing");
    }
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      const response = await fetch(`/api/services/${selectedService.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
        setShowDeleteConfirm(false);
        setSelectedService(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-3">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-600 mt-1">View Plans & Pricing section</p>
        </div>

        {/* Header Section */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchServices}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-sm"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052a8] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Add Service</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Plans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.type === "BASE" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {service.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.billingInterval.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {service.categories.map(c => c.category.name).join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.features.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service._count?.planServices || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleManagePricing(service)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Pricing
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal - Continues in next message due to length */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex justify-center">
          <div className="bg-white shadow-2xl max-w-4xl w-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showEditModal ? "Edit Service" : "Add Service"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "BASE" | "ADDON" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="BASE">BASE</option>
                      <option value="ADDON">ADDON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Interval</label>
                    <select
                      value={formData.billingInterval}
                      onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ONE_TIME">ONE TIME</option>
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="YEARLY">YEARLY</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <label key={cat.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, categories: [...formData.categories, cat.id] });
                              } else {
                                setFormData({ ...formData, categories: formData.categories.filter(id => id !== cat.id) });
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Feature name"
                          value={feature.name}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index].name = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={feature.description || ""}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index].description = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formData.features.filter((_, i) => i !== index);
                            setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [{ name: "", description: "", sortOrder: 0 }] });
                          }}
                          className="col-span-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        features: [...formData.features, { name: "", description: "", sortOrder: formData.features.length }]
                      })}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Feature
                    </button>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedService(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052a8]"
                  >
                    {showEditModal ? "Save Changes" : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && selectedService && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50">
          <div className="h-full flex items-start justify-center">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full h-full overflow-y-auto">
              <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manage Pricing - {selectedService.name}
              </h2>
              <form onSubmit={handleSavePricing}>
                <div className="space-y-4">
                  {formData.pricing.map((price, index) => {
                    const companyType = companyTypes.find(ct => ct.id === price.companyTypeId);
                    return (
                      <div key={price.companyTypeId} className="flex items-center space-x-4">
                        <label className="w-40 text-sm font-medium text-gray-700">
                          {companyType?.name}
                        </label>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(price.priceCents / 100).toFixed(2)}
                            onChange={(e) => {
                              const newPricing = [...formData.pricing];
                              newPricing[index].priceCents = Math.round(parseFloat(e.target.value) * 100);
                              setFormData({ ...formData, pricing: newPricing });
                            }}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPricingModal(false);
                      setSelectedService(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052a8]"
                  >
                    Save Pricing
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedService.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedService(null);
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
