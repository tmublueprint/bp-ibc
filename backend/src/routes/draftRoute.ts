import { Router } from 'express'
import { getDraft, postDraft } from '../controllers/draftController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/draft/:id', getDraft);
router.post('/draft', postDraft);

export default router;