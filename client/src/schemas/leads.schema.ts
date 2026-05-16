import { z } from 'zod';

export const STATUS_VALUES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const SOURCE_VALUES = ['Website', 'Instagram', 'Referral'] as const;

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name must be at most 80 characters'),
  email: z.string().email('Must be a valid email address'),
  status: z.enum(STATUS_VALUES).default('New'),
  source: z.enum(SOURCE_VALUES, { error: 'Please select a source' }),
});

export const updateLeadSchema = createLeadSchema.partial();

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
