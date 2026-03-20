'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api-config';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  documentType: string;
  submittedBy: {
    name: string;
    email: string;
  };
  company: {
    id: string;
    name: string;
  };
  uploadedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  adminNotes?: string;
}

export default function DocumentApproval() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data || []);
      } else {
        // Mock data for demonstration
        setDocuments([
          {
            id: '1',
            fileName: 'Articles_of_Organization.pdf',
            fileType: 'PDF',
            documentType: 'Articles of Organization',
            submittedBy: { name: 'John Doe', email: 'john@example.com' },
            company: { id: '1', name: 'Tech Startup Inc' },
            uploadedDate: '2026-03-18',
            status: 'pending',
            notes: 'Submitted for LLC formation verification'
          },
          {
            id: '2',
            fileName: 'EIN_Confirmation.pdf',
            fileType: 'PDF',
            documentType: 'EIN Confirmation Letter',
            submittedBy: { name: 'Jane Smith', email: 'jane@example.com' },
            company: { id: '2', name: 'Digital Solutions LLC' },
            uploadedDate: '2026-03-17',
            status: 'pending',
            notes: 'EIN letter from IRS'
          },
          {
            id: '3',
            fileName: 'Business_License.pdf',
            fileType: 'PDF',
            documentType: 'Business License',
            submittedBy: { name: 'Mike Johnson', email: 'mike@example.com' },
            company: { id: '3', name: 'Creative Agency Co' },
            uploadedDate: '2026-03-16',
            status: 'approved',
            adminNotes: 'Verified and approved - all requirements met'
          },
          {
            id: '4',
            fileName: 'Tax_Return_2025.pdf',
            fileType: 'PDF',
            documentType: 'Tax Return',
            submittedBy: { name: 'Sarah Williams', email: 'sarah@example.com' },
            company: { id: '4', name: 'Innovation Labs' },
            uploadedDate: '2026-03-15',
            status: 'pending',
            notes: 'Corporate tax return filing'
          },
          {
            id: '5',
            fileName: 'Formation_Document.pdf',
            fileType: 'PDF',
            documentType: 'Formation Document',
            submittedBy: { name: 'Robert Brown', email: 'robert@example.com' },
            company: { id: '5', name: 'Global Ventures LLC' },
            uploadedDate: '2026-03-14',
            status: 'rejected',
            adminNotes: 'Rejected - Missing required signatures'
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (docId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/documents/${docId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes: adminNotes[docId] || '' })
      });

      setDocuments(documents.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'approved', adminNotes: adminNotes[docId] || '' }
          : doc
      ));
      setShowApproveModal(null);
      setAdminNotes({ ...adminNotes, [docId]: '' });
    } catch (error) {
      console.error('Failed to approve document:', error);
    }
  };

  const handleReject = async (docId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/documents/${docId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes: rejectReason })
      });

      setDocuments(documents.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'rejected', adminNotes: rejectReason }
          : doc
      ));
      setShowRejectModal(null);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
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
          Document Approval
        </h1>
        <p className="text-gray-600 text-lg">
          Review and approve documents submitted by users for verification
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{documents.filter(d => d.status === 'approved').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{documents.filter(d => d.status === 'rejected').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by document name, user, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003174] bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchDocuments}
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-2">No documents found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* Document Header */}
              <div
                className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(doc.status)} font-semibold`}>
                    {getStatusIcon(doc.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{doc.fileName}</h3>
                    <p className="text-gray-500 text-sm">{doc.documentType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedDoc === doc.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Document Details (Expanded) */}
              {expandedDoc === doc.id && (
                <div className="border-t border-gray-200 px-8 py-6 bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Submitted By */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Submitted By</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#003174] to-[#0052a8] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {doc.submittedBy.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.submittedBy.name}</p>
                            <p className="text-sm text-gray-500">{doc.submittedBy.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{doc.company.name}</p>
                        <p className="text-sm text-gray-500">ID: {doc.company.id}</p>
                      </div>
                    </div>

                    {/* File Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">File Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="text-gray-500">Type:</span> <span className="font-medium text-gray-900">{doc.fileType}</span></p>
                        <p className="text-sm"><span className="text-gray-500">Uploaded:</span> <span className="font-medium text-gray-900">{new Date(doc.uploadedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
                      </div>
                    </div>

                    {/* Notes */}
                    {doc.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Submission Notes</h4>
                        <p className="text-sm text-gray-700">{doc.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes Display */}
                  {doc.adminNotes && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Admin Notes</h4>
                      <p className="text-sm text-gray-700">{doc.adminNotes}</p>
                    </div>
                  )}

                  {/* Actions (Only for Pending) */}
                  {doc.status === 'pending' && (
                    <div className="space-y-4">
                      {/* Admin Notes Input */}
                      <div>
                        <label className="text-sm font-semibold text-gray-900 block mb-2">Add Admin Notes</label>
                        <textarea
                          value={adminNotes[doc.id] || ''}
                          onChange={(e) => setAdminNotes({ ...adminNotes, [doc.id]: e.target.value })}
                          placeholder="Add notes about this document..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowApproveModal(doc.id)}
                          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Approve Document
                        </button>
                        <button
                          onClick={() => setShowRejectModal(doc.id)}
                          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Reject Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Document?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this document? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApproveModal)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Document?</h3>
            <p className="text-gray-600 mb-4">
              Add a reason for rejection that will be sent to the user.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-6"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
