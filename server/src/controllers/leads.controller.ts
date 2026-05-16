import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
  listLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../services/leads.service';
import { leadsToCsv } from '../utils/csv';
import type {
  CreateLeadInput,
  UpdateLeadInput,
  ListLeadsQuery,
} from '../validators/leads.schema';

function getRequester(req: Request): { id: string; role: 'admin' | 'sales' } {
  if (!req.user) throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
  return req.user;
}

export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  // req.query has been coerced and validated by the validate middleware
  const result = await listLeads(req.query as unknown as ListLeadsQuery, requester);
  res.json(result);
});

export const getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  // req.params validated by idParamSchema — id is a valid ObjectId string
  const { id } = req.params as unknown as { id: string };
  const lead = await getLeadById(id, requester);
  res.json({ data: lead });
});

export const createLeadHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  const lead = await createLead(req.body as CreateLeadInput, requester);
  res.status(201).json({ data: lead });
});

export const updateLeadHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  const { id } = req.params as unknown as { id: string };
  const lead = await updateLead(id, req.body as UpdateLeadInput, requester);
  res.json({ data: lead });
});

export const deleteLeadHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  const { id } = req.params as unknown as { id: string };
  await deleteLead(id, requester);
  res.status(200).json({ data: null });
});

export const exportLeadsHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requester = getRequester(req);
  // req.query validated by listLeadsQuerySchema minus page/limit
  const query = req.query as unknown as Omit<ListLeadsQuery, 'page' | 'limit'>;
  const leads = await exportLeads(query, requester);
  const csv = leadsToCsv(leads);
  const timestamp = Date.now();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${timestamp}.csv"`);
  res.send(csv);
});
