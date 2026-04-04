const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...Object.fromEntries(new Headers(options.headers as HeadersInit)),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw { response: { data: error } };
  }

  return response.json();
}

export async function login(username: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function register(username: string, password: string, email?: string) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });
}

export async function getFiles() {
  return request('/files');
}

export async function getFile(id: number) {
  return request(`/files/${id}`);
}

export async function createFile(title: string, content: string) {
  return request('/files', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export async function updateFile(id: number, title: string, content: string) {
  return request(`/files/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

export async function deleteFile(id: number) {
  return request(`/files/${id}`, {
    method: 'DELETE',
  });
}

export async function createShare(fileId: number, expiresInHours?: number) {
  return request('/shares', {
    method: 'POST',
    body: JSON.stringify({ fileId, expiresInHours }),
  });
}

export async function getSharedFile(shareToken: string) {
  return request(`/shares/${shareToken}`);
}