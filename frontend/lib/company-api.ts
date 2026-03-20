import { API_URL } from "./api-config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Tasks API
export const tasksAPI = {
  getAll: async (companyId: number) => {
    const response = await fetch(`${API_URL}/tasks?companyId=${companyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  create: async (companyId: number, data: any) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ companyId, ...data }),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return response.json();
  },
};

// Documents API
export const documentsAPI = {
  getAll: async (companyId: number) => {
    const response = await fetch(`${API_URL}/documents?companyId=${companyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch documents");
    return response.json();
  },

  create: async (companyId: number, data: any) => {
    const response = await fetch(`${API_URL}/documents`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ companyId, ...data }),
    });
    if (!response.ok) throw new Error("Failed to create document");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete document");
    return response.json();
  },
};

// Tax Filings API
export const taxFilingsAPI = {
  getAll: async (companyId: number) => {
    const response = await fetch(`${API_URL}/tax-filings?companyId=${companyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch tax filings");
    return response.json();
  },

  create: async (companyId: number, data: any) => {
    const response = await fetch(`${API_URL}/tax-filings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ companyId, ...data }),
    });
    if (!response.ok) throw new Error("Failed to create tax filing");
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/tax-filings/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update tax filing");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/tax-filings/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete tax filing");
    return response.json();
  },
};

// Notes API
export const notesAPI = {
  getAll: async (companyId: number) => {
    const response = await fetch(`${API_URL}/notes?companyId=${companyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },

  create: async (companyId: number, content: string, createdBy?: string) => {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ companyId, content, createdBy }),
    });
    if (!response.ok) throw new Error("Failed to create note");
    return response.json();
  },

  update: async (id: number, content: string) => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to update note");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete note");
    return response.json();
  },
};
