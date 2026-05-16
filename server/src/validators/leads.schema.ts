import { z } from 'zod';
import { Types } from 'mongoose';

const STATUS_VALUES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const SOURCE_VALUES = ['Website', 'Instagram', 'Referral'] as const;

export const createLeadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  status: z.enum(STATUS_VALUES).default('New'),
  source: z.enum(SOURCE_VALUES),
});

export const updateLeadSchema = createLeadSchema.partial();

export const listLeadsQuerySchema = z.object({
  status: z.enum(STATUS_VALUES).optional(),
  source: z.enum(SOURCE_VALUES).optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).default('latest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Invalid ID format' },
);

export const idParamSchema = z.object({ id: objectIdSchema });

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
