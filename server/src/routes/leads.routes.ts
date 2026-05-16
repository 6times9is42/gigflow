import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLeadHandler,
  updateLeadHandler,
  deleteLeadHandler,
  exportLeadsHandler,
} from '../controllers/leads.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  listLeadsQuerySchema,
  idParamSchema,
} from '../validators/leads.schema';

const router = Router();

// All leads routes require authentication
router.use(authenticate);

router.get('/', validate(listLeadsQuerySchema, 'query'), getLeads);
// /export must be registered before /:id so it isn't matched as an id param
router.get(
  '/export',
  validate(listLeadsQuerySchema.omit({ page: true, limit: true }), 'query'),
  exportLeadsHandler,
);
router.get('/:id', validate(idParamSchema, 'params'), getLead);
router.post('/', validate(createLeadSchema), createLeadHandler);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateLeadSchema),
  updateLeadHandler,
);
router.delete('/:id', validate(idParamSchema, 'params'), deleteLeadHandler);

export default router;
