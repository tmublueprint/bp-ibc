import { Router } from 'express';
import {
    getSites,
    getSiteById,
    createSite,
    updateSite,
    deleteSite,
} from '../controllers/siteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/sites', getSites);
router.post('/sites', createSite);
router.get('/sites/:siteId', getSiteById);
router.patch('/sites/:siteId', updateSite);
router.delete('/sites/:siteId', deleteSite);

export default router;
