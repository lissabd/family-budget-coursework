// src/api/auth.ts

import { UserCreate, UserRead } from '../types/auth';
import api from './axios';


export async function register(data: UserCreate): Promise<UserRead> {
  const resp = await api.post<UserRead>('/auth/register', data);
  return resp.data;
}

export async function login(data: Omit<UserCreate, 'family_code'>): Promise<void> {
  // мы не ждем данных тела, а куку установит сервер
  await api.post('/auth/login', data);
}

export async function fetchCurrentUser(): Promise<UserRead> {
  const resp = await api.get<UserRead>('/auth/me');
  return resp.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
