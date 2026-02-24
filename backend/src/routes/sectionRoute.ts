import { Router } from 'express';
import {
    getSections,
    createSection,
    getSection,
    updateSection,
    deleteSection,
    reorderSections,
} from '../controllers/sectionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/pages/:pageId/sections', getSections);
router.post('/pages/:pageId/sections', createSection);
router.get('/pages/:pageId/sections/:sectionId', getSection);
router.patch('/pages/:pageId/sections/:sectionId', updateSection);
router.delete('/pages/:pageId/sections/:sectionId', deleteSection);
router.patch('/pages/:pageId/sections/reorder', reorderSections);

export default router;