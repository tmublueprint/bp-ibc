import { Request, Response } from 'express';
import { getPublishedBySiteId } from '../services/publishedService';
import { getPagesBydraftId } from '../services/pageService';

// GET /api/public/sites/:siteId/content — no auth required
export async function getPublishedContent(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const published = await getPublishedBySiteId(siteId);
        if (!published || !published.draft_id) {
            return res.status(404).json({ message: 'No published version found' });
        }
        const pages = await getPagesBydraftId(published.draft_id);
        return res.status(200).json({ published, pages });
    } catch (e) {
        console.error('Error fetching published content:', e);
        return res.status(500).json({ error: 'Failed to fetch published content' });
    }
}
