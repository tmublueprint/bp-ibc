import { Router } from 'express';
import {
    getDrafts,
    createDraft,
    getDraftById,
    updateDraft,
    deleteDraft,
} from '../controllers/draftController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/sites/:siteId/drafts', getDrafts);
router.post('/sites/:siteId/drafts', createDraft);
router.get('/sites/:siteId/drafts/:draftId', getDraftById);
router.patch('/sites/:siteId/drafts/:draftId', updateDraft);
router.delete('/sites/:siteId/drafts/:draftId', deleteDraft);

export default router;