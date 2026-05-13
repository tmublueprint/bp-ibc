import { Router } from 'express';
import { getPublishedContent } from '../controllers/publicController';

const router = Router();

// No auth — public read endpoint for the live site
router.get('/public/sites/:siteId/content', getPublishedContent);

export default router;
