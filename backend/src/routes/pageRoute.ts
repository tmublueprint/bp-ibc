import { Router } from 'express';
import { getPage } from '../controllers/pageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/pages/:id', getPage);

export default router;