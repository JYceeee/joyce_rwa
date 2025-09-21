// src/service/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

type Json = Record<string, any>;

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body,
    credentials: 'include', // 如需 cookie，可保留；仅用 localStorage 可删除
  });

  // 尝试解析 JSON
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // 有些后端可能 204 无内容
  }

  if (!res.ok) {
    const msg = (data && data.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export function signup(email: string, password: string, name?: string) {
  return request('/user/reguser', {
    method: 'POST',
    body: JSON.stringify({ 
      user_email: email, 
      user_password: password,
      user_name: name || email.split('@')[0],
      user_id: 'user_' + Date.now(),
      user_phone: ''
    }),
  });
}

export function login(email: string, password: string) {
  return request<{ token: string; user?: Json }>('/user/login', {
    method: 'POST',
    body: JSON.stringify({ user_email: email, user_password: password }),
  });
}
