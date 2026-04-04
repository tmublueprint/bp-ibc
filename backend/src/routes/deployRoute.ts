import { Router } from 'express';
import { postDeploy } from '../controllers/deployController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/deploy', postDeploy);

export default router;
