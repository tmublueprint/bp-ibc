import { Request, Response } from 'express';
import {
    publishDraft,
    getPublishedBySiteId,
    getPublishedVersionsBySiteId,
    getPublishedVersionById as getPublishedVersionByIdService,
} from '../services/publishedService';
import { DraftModel } from '../models/draftModel';

function isValidDraftPayload(payload: unknown): payload is DraftModel {
    if (!payload || typeof payload !== 'object') {
        return false;
    }

    const draft = payload as Record<string, unknown>;

    return (
        typeof draft.id === 'string' &&
        draft.id.trim().length > 0 &&
        typeof draft.site_id === 'string' &&
        draft.site_id.trim().length > 0 &&
        typeof draft.version === 'number' &&
        Number.isFinite(draft.version) &&
        typeof draft.is_active === 'boolean'
    );
}

// POST /api/sites/:siteId/publish - Publish provided draft
export async function publishSite(req: Request, res: Response) {
    try {
        const { siteId } = req.params;

        if (!siteId?.trim()) {
            return res.status(400).json({ message: 'Invalid siteId' });
        }

        if (!isValidDraftPayload(req.body)) {
            return res.status(400).json({ message: 'Invalid draft payload' });
        }

        if (req.body.site_id !== siteId) {
            return res.status(400).json({ message: 'Draft site_id must match route siteId' });
        }

        const publishedVersion = await publishDraft(siteId, req.body);

        return res.status(201).json({
            message: 'Draft published successfully',
            data: publishedVersion,
        });
    } catch (e) {
        if ((e as { statusCode?: number }).statusCode === 400) {
            return res.status(400).json({ message: (e as Error).message });
        }

        console.error('Error publishing site:', e);
        return res.status(500).json({ message: 'Failed to publish site' });
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
