import { Request, Response } from 'express';
import {
    publishDraft,
    getPublishedBySiteId,
    getPublishedVersionsBySiteId,
    getPublishedVersionById as getPublishedVersionByIdService,
} from '../services/publishedService';

// POST /api/sites/:siteId/publish - Publish current active draft
export async function publishSite(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const publishedVersion = await publishDraft(siteId);
        if (publishedVersion) {
            return res.status(201).json(publishedVersion);
        } else {
            return res.status(400).json({ message: 'No active draft to publish' });
        }
    } catch (e) {
        console.error('Error publishing site:', e);
        return res.status(500).json({ error: 'Failed to publish site' });
    }
}

// GET /api/sites/:siteId/published - Get current published version
export async function getPublishedVersion(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const published = await getPublishedBySiteId(siteId);
        if (published) {
            return res.status(200).json(published);
        } else {
            return res.status(404).json({ message: 'No published version found' });
        }
    } catch (e) {
        console.error('Error fetching published version:', e);
        return res.status(500).json({ error: 'Failed to fetch published version' });
    }
}

// GET /api/sites/:siteId/published/versions - List all published versions
export async function getPublishedVersions(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const versions = await getPublishedVersionsBySiteId(siteId);
        return res.status(200).json(versions);
    } catch (e) {
        console.error('Error fetching published versions:', e);
        return res.status(500).json({ error: 'Failed to fetch published versions' });
    }
}

// GET /api/sites/:siteId/published/versions/:versionId - Get specific published version
export async function getPublishedVersionById(req: Request, res: Response) {
    try {
        const { siteId, versionId } = req.params;
        const version = await getPublishedVersionByIdService(versionId);
        if (version && version.site_id === siteId) {
            return res.status(200).json(version);
        } else {
            return res.status(404).json({ message: 'Published version not found' });
        }
    } catch (e) {
        console.error('Error fetching published version:', e);
        return res.status(500).json({ error: 'Failed to fetch published version' });
    }
}
