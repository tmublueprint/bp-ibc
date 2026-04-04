import { Router } from 'express';
import {
    publishSite,
    getPublishedVersion,
    getPublishedVersions,
    getPublishedVersionById,
} from '../controllers/publishedController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/sites/:siteId/publish', publishSite);
router.get('/sites/:siteId/published', getPublishedVersion);
router.get('/sites/:siteId/published/versions', getPublishedVersions);
router.get('/sites/:siteId/published/versions/:versionId', getPublishedVersionById);

export default router;
