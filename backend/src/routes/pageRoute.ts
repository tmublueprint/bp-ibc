import { Router } from 'express';
import {
    getPages,
    createPage,
    getPageById,
    updatePage,
    deletePage,
} from '../controllers/pageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/drafts/:draftId/pages', getPages);
router.post('/drafts/:draftId/pages', createPage);
router.get('/drafts/:draftId/pages/:pageId', getPageById);
router.patch('/drafts/:draftId/pages/:pageId', updatePage);
router.delete('/drafts/:draftId/pages/:pageId', deletePage);

export default router;