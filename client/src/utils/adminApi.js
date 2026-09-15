const API_URL = import.meta.env.VITE_API_URL;

export { API_URL };

export function getToken() {
  return localStorage.getItem('gm_token');
}

export function getUser() {
  try {
    const raw = localStorage.getItem('gm_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(token, user) {
  localStorage.setItem('gm_token', token);
  localStorage.setItem('gm_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('gm_token');
  localStorage.removeItem('gm_user');
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

export async function apiUpload(path, formData, method = 'POST') {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Upload failed');
  return json;
}
