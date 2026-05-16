import { Types } from 'mongoose';
import { Lead, type ILead } from '../models/Lead.model';
import { AppError } from '../utils/AppError';
import type { CreateLeadInput, UpdateLeadInput, ListLeadsQuery } from '../validators/leads.schema';

interface Requester {
  id: string;
  role: 'admin' | 'sales';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeadsListResult {
  data: ILead[];
  pagination: PaginationMeta;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(
  query: Pick<ListLeadsQuery, 'status' | 'source' | 'search'>,
  requester: Requester,
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  // RBAC: sales users see only their own leads
  if (requester.role === 'sales') {
    filter['ownerId'] = new Types.ObjectId(requester.id);
  }

  if (query.status !== undefined) filter['status'] = query.status;
  if (query.source !== undefined) filter['source'] = query.source;

  if (query.search !== undefined && query.search.length > 0) {
    const escaped = escapeRegex(query.search);
    filter['$or'] = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
    ];
  }

  return filter;
}

export async function listLeads(
  query: ListLeadsQuery,
  requester: Requester,
): Promise<LeadsListResult> {
  const filter = buildFilter(query, requester);
  const sortDir = query.sort === 'oldest' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortDir }).skip(skip).limit(query.limit).lean<ILead[]>(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / query.limit);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  };
}

export async function getLeadById(id: string, requester: Requester): Promise<ILead> {
  const lead = await Lead.findById(id).lean<ILead>();
  if (!lead) throw new AppError(404, 'Lead not found', 'NOT_FOUND');

  if (requester.role === 'sales' && lead.ownerId.toString() !== requester.id) {
    throw new AppError(403, 'Access denied', 'FORBIDDEN');
  }

  return lead;
}

export async function createLead(
  input: CreateLeadInput,
  requester: Requester,
): Promise<ILead> {
  const lead = await Lead.create({
    ...input,
    ownerId: new Types.ObjectId(requester.id),
  });
  // toJSON strips __v; cast via unknown is required because lean types and document
  // types diverge after toJSON transform. This is an intentional boundary.
  return lead.toJSON() as unknown as ILead;
}

export async function updateLead(
  id: string,
  input: UpdateLeadInput,
  requester: Requester,
): Promise<ILead> {
  const ownerFilter =
    requester.role === 'sales'
      ? { _id: id, ownerId: new Types.ObjectId(requester.id) }
      : { _id: id };

  const updated = await Lead.findOneAndUpdate(ownerFilter, { $set: input }, { new: true }).lean<ILead>();
  if (!updated) {
    const exists = await Lead.exists({ _id: id });
    throw new AppError(
      exists ? 403 : 404,
      exists ? 'Access denied' : 'Lead not found',
      exists ? 'FORBIDDEN' : 'NOT_FOUND',
    );
  }
  return updated;
}

export async function deleteLead(id: string, requester: Requester): Promise<void> {
  const ownerFilter =
    requester.role === 'sales'
      ? { _id: id, ownerId: new Types.ObjectId(requester.id) }
      : { _id: id };

  const deleted = await Lead.findOneAndDelete(ownerFilter);
  if (!deleted) {
    const exists = await Lead.exists({ _id: id });
    throw new AppError(
      exists ? 403 : 404,
      exists ? 'Access denied' : 'Lead not found',
      exists ? 'FORBIDDEN' : 'NOT_FOUND',
    );
  }
}

export async function exportLeads(
  query: Omit<ListLeadsQuery, 'page' | 'limit'>,
  requester: Requester,
): Promise<ILead[]> {
  const filter = buildFilter(query, requester);
  const sortDir = query.sort === 'oldest' ? 1 : -1;
  return Lead.find(filter).sort({ createdAt: sortDir }).lean<ILead[]>();
}
