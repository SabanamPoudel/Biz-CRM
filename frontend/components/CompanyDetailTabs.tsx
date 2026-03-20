"use client";

import { useEffect, useState } from "react";
import { tasksAPI, documentsAPI, taxFilingsAPI, notesAPI } from "@/lib/company-api";
import { TaskModal, DocumentModal, TaxFilingModal } from "@/components/CompanyModals";

// Tasks Tab Component
export function TasksTab({ company }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    loadTasks();
  }, [company.id]);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getAll(company.id);
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await tasksAPI.create(company.id, formData);
      await loadTasks();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await tasksAPI.update(editingTask.id, formData);
      await loadTasks();
      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await tasksAPI.delete(id);
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#003174]">Tasks Overview</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
        >
          + Add New Task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174] mx-auto"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-[#e7edfc] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tasks Yet</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started with project management</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e7edfc]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600">{task.description.substring(0, 50)}...</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.assignedTo || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-[#003174] hover:text-[#0052b4] font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-[#c51111] hover:text-[#a00e0e] font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
      />
    </div>
  );
}

// Documents Tab Component
export function DocumentsTab({ company }: any) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [company.id]);

  const loadDocuments = async () => {
    try {
      const data = await documentsAPI.getAll(company.id);
      setDocuments(data);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await documentsAPI.create(company.id, formData);
      await loadDocuments();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to upload document");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await documentsAPI.delete(id);
      await loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#003174]">Documents Library</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
        >
          + Upload Document
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174] mx-auto"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-[#e7edfc] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-gray-600 mb-6">Upload your company documents to keep everything organized</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
          >
            Upload First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#e7edfc] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-[#c51111] hover:text-[#a00e0e] p-1"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
              <div className="text-xs text-gray-500">
                {doc.uploadedBy && <div>Uploaded by: {doc.uploadedBy}</div>}
                <div>Date: {new Date(doc.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}

// Tax Filings Tab Component  
export function TaxFilingsTab({ company }: any) {
  const [taxFilings, setTaxFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFiling, setEditingFiling] = useState<any>(null);

  useEffect(() => {
    loadTaxFilings();
  }, [company.id]);

  const loadTaxFilings = async () => {
    try {
      const data = await taxFilingsAPI.getAll(company.id);
      setTaxFilings(data);
    } catch (error) {
      console.error("Error loading tax filings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await taxFilingsAPI.create(company.id, formData);
      await loadTaxFilings();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating tax filing:", error);
      alert("Failed to create tax filing");
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await taxFilingsAPI.update(editingFiling.id, formData);
      await loadTaxFilings();
      setShowModal(false);
      setEditingFiling(null);
    } catch (error) {
      console.error("Error updating tax filing:", error);
      alert("Failed to update tax filing");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tax filing?")) return;
    
    try {
      await taxFilingsAPI.delete(id);
      await loadTaxFilings();
    } catch (error) {
      console.error("Error deleting tax filing:", error);
      alert("Failed to delete tax filing");
    }
  };

  const openEditModal = (filing: any) => {
    setEditingFiling(filing);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFiling(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#003174]">Tax Filings</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
        >
          + Add Tax Filing
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174] mx-auto"></div>
        </div>
      ) : taxFilings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-[#e7edfc] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tax Filings Yet</h3>
          <p className="text-gray-600 mb-6">Track your tax filings and deadlines in one place</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium"
          >
            Add First Filing
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e7edfc]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#003174] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {taxFilings.map((filing) => (
                  <tr key={filing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{filing.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{filing.quarter}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{filing.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        filing.status === 'approved' ? 'bg-green-100 text-green-800' :
                        filing.status === 'filed' ? 'bg-blue-100 text-blue-800' :
                        filing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {filing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {filing.dueDate ? new Date(filing.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {filing.amount ? `$${Number(filing.amount).toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(filing)}
                          className="text-[#003174] hover:text-[#0052b4] font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(filing.id)}
                          className="text-[#c51111] hover:text-[#a00e0e] font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TaxFilingModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={editingFiling ? handleUpdate : handleCreate}
        taxFiling={editingFiling}
      />
    </div>
  );
}

// Notes Tab Component
export function NotesTab({ company }: any) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<any>(null);

  useEffect(() => {
    loadNotes();
  }, [company.id]);

  const loadNotes = async () => {
    try {
      const data = await notesAPI.getAll(company.id);
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNote.trim()) return;
    
    try {
      await notesAPI.create(company.id, newNote, company.userName);
      setNewNote("");
      await loadNotes();
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to save note");
    }
  };

  const handleUpdate = async (id: number, content: string) => {
    try {
      await notesAPI.update(id, content);
      setEditingNote(null);
      await loadNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await notesAPI.delete(id);
      await loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#003174]">Notes</h2>

      {/* Add Note */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003174] focus:border-transparent resize-none"
          rows={4}
          placeholder="Write your note here..."
        />
        <button
          onClick={handleCreate}
          disabled={!newNote.trim()}
          className="mt-3 px-6 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Note
        </button>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174] mx-auto"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-[#e7edfc] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-[#003174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Notes Yet</h3>
          <p className="text-gray-600">Add notes to keep track of important information</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {editingNote?.id === note.id ? (
                <div>
                  <textarea
                    defaultValue={note.content}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003174] focus:border-transparent resize-none"
                    rows={3}
                    id={`edit-note-${note.id}`}
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => {
                        const textarea = document.getElementById(`edit-note-${note.id}`) as HTMLTextAreaElement;
                        handleUpdate(note.id, textarea.value);
                      }}
                      className="px-4 py-2 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-900 whitespace-pre-wrap mb-4">{note.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      {note.createdBy && <span className="font-medium">{note.createdBy}</span>}
                      <span className="mx-2">•</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="text-[#003174] hover:text-[#0052b4] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-[#c51111] hover:text-[#a00e0e] font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
