import {Router} from 'express';
import { postSection, getSection, getAllSections } from '../controllers/sectionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/sections', postSection);
router.get('/sections/:id', getSection);
router.get('/sections', getAllSections);

export default router;