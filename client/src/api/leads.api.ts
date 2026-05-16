import { apiClient } from './client';
import type { ApiResponse, ApiListResponse, Lead } from '@/types/api';

export interface LeadsQuery {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export async function getLeadsApi(
  query: LeadsQuery = {},
  signal?: AbortSignal,
): Promise<ApiListResponse<Lead>> {
  const { data } = await apiClient.get<ApiListResponse<Lead>>('/leads', {
    params: query,
    signal,
  });
  return data;
}

export async function getLeadApi(id: string): Promise<Lead> {
  const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
  return data.data;
}

export async function createLeadApi(payload: CreateLeadPayload): Promise<Lead> {
  const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
  return data.data;
}

export async function updateLeadApi(
  id: string,
  payload: UpdateLeadPayload,
): Promise<Lead> {
  const { data } = await apiClient.put<ApiResponse<Lead>>(
    `/leads/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteLeadApi(id: string): Promise<void> {
  await apiClient.delete(`/leads/${id}`);
}

export async function exportLeadsApi(
  query: Omit<LeadsQuery, 'page' | 'limit'> = {},
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>('/leads/export', {
    params: query,
    responseType: 'blob',
  });
  return data;
}
