import { Router } from 'express';
import {
    getContents,
    createContentBlock,
    getContent,
    updateContent,
    deleteContent,
} from '../controllers/contentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/sections/:sectionId/contents', getContents);
router.post('/sections/:sectionId/contents', createContentBlock);
router.get('/sections/:sectionId/contents/:contentId', getContent);
router.patch('/sections/:sectionId/contents/:contentId', updateContent);
router.delete('/sections/:sectionId/contents/:contentId', deleteContent);

export default router;
