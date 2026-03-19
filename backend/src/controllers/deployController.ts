import { Request, Response } from 'express';
import { triggerDeploy } from '../services/deployService';

export async function postDeploy(req: Request, res: Response) {
  try {
    const result = await triggerDeploy();
    return res.status(200).json(result);
  } catch (e) {
    console.error('Error triggering deploy:', e);
    const message = e instanceof Error ? e.message : 'Failed to trigger deploy';
    return res.status(500).json({ error: message });
  }
}
