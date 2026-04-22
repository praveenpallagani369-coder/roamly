import { getToken } from '../contexts/AuthContext';

const BASE = '/api/v1';

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.error?.message || 'Request failed');
    err.code = json.error?.code;
    err.fields = json.error?.fields;
    err.status = res.status;
    throw err;
  }

  return json;
}

export const tripsApi = {
  create: (data) => request('/trips', { method: 'POST', body: data }),
  getById: (id) => request(`/trips/${id}`),
  list: () => request('/trips')
};

export const authApi = {
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data })
};
