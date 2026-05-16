import { apiClient } from './client';
import type { ApiResponse, User } from '@/types/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiResponse<AuthResult>>(
    '/auth/register',
    payload,
  );
  return data.data;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiResponse<AuthResult>>(
    '/auth/login',
    payload,
  );
  return data.data;
}

export async function getMeApi(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
  return data.data;
}
