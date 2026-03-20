"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CompanyType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  advantages: string[];
  disadvantages: string[];
  isActive: boolean;
  sortOrder: number;
  _count?: {
    servicePricing: number;
  };
}

export default function CompanyTypesPage() {
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCompanyType, setSelectedCompanyType] = useState<CompanyType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    advantages: [""],
    disadvantages: [""],
    isActive: true,
    sortOrder: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchCompanyTypes();
  }, []);

  const fetchCompanyTypes = async () => {
    try {
      const response = await fetch("/api/company-types");
      if (!response.ok) throw new Error("Failed to fetch company types");
      const data = await response.json();
      setCompanyTypes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company types:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      advantages: [""],
      disadvantages: [""],
      isActive: true,
      sortOrder: companyTypes.length,
    });
    setShowAddModal(true);
  };

  const handleEdit = (companyType: CompanyType) => {
    setSelectedCompanyType(companyType);
    setFormData({
      name: companyType.name,
      slug: companyType.slug,
      description: companyType.description || "",
      advantages: companyType.advantages.length > 0 ? companyType.advantages : [""],
      disadvantages: companyType.disadvantages.length > 0 ? companyType.disadvantages : [""],
      isActive: companyType.isActive,
      sortOrder: companyType.sortOrder,
    });
    setShowEditModal(true);
  };

  const handleDelete = (companyType: CompanyType) => {
    setSelectedCompanyType(companyType);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        advantages: formData.advantages.filter(a => a.trim() !== ""),
        disadvantages: formData.disadvantages.filter(d => d.trim() !== ""),
      };

      console.log('Submitting:', { showEditModal, selectedCompanyType, payload });

      let response;
      if (showEditModal && selectedCompanyType) {
        console.log('PUT request to:', `/api/company-types/${selectedCompanyType.id}`);
        response = await fetch(`/api/company-types/${selectedCompanyType.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        console.log('POST request to:', `/api/company-types`);
        response = await fetch("/api/company-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Success! Refreshing data...');
        fetchCompanyTypes();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedCompanyType(null);
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert(error.error || "Failed to save company type");
      }
    } catch (error) {
      console.error("Error saving company type:", error);
      alert("Error saving company type");
    }
  };

  const confirmDelete = async () => {
    if (!selectedCompanyType) return;

    try {
      const response = await fetch(`/api/company-types/${selectedCompanyType.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCompanyTypes();
        setShowDeleteConfirm(false);
        setSelectedCompanyType(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete company type");
      }
    } catch (error) {
      console.error("Error deleting company type:", error);
      alert("Error deleting company type");
    }
  };

  const filteredCompanyTypes = companyTypes.filter((ct) =>
    ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ct.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-3">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/services/plans"
            className="text-sm text-[#003174] hover:text-[#0052a8] font-medium flex items-center space-x-1 mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Plans & Pricing</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Company Types</h1>
        </div>

        {/* Header Section */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchCompanyTypes}
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
              <span className="text-sm font-medium">Add Company Type</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanyTypes.map((ct) => (
                  <tr key={ct.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ct.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ct.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {ct.description || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ct.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {ct.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ct.sortOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(ct)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ct)}
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex justify-center">
          <div className="bg-white shadow-2xl max-w-2xl w-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showEditModal ? "Edit Company Type" : "Add Company Type"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advantages</label>
                    {formData.advantages.map((adv, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={adv}
                          onChange={(e) => {
                            const newAdv = [...formData.advantages];
                            newAdv[index] = e.target.value;
                            setFormData({ ...formData, advantages: newAdv });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newAdv = formData.advantages.filter((_, i) => i !== index);
                            setFormData({ ...formData, advantages: newAdv.length > 0 ? newAdv : [""] });
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, advantages: [...formData.advantages, ""] })}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Advantage
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disadvantages</label>
                    {formData.disadvantages.map((dis, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={dis}
                          onChange={(e) => {
                            const newDis = [...formData.disadvantages];
                            newDis[index] = e.target.value;
                            setFormData({ ...formData, disadvantages: newDis });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newDis = formData.disadvantages.filter((_, i) => i !== index);
                            setFormData({ ...formData, disadvantages: newDis.length > 0 ? newDis : [""] });
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, disadvantages: [...formData.disadvantages, ""] })}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Disadvantage
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedCompanyType(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052a8]"
                  >
                    {showEditModal ? "Save Changes" : "Add Company Type"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedCompanyType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCompanyType.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedCompanyType(null);
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
