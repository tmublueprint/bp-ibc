import { Request, Response } from 'express';
import {
    createDraft as createDraftService,
    getDraftById as getDraftByIdService,
    getDraftsBySiteId,
    updateDraftById,
    deleteDraftById,
} from '../services/draftService';
import { DraftModel, DraftPostModel } from '../models/draftModel';

// GET /api/sites/:siteId/drafts - List all drafts for a site
export async function getDrafts(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const drafts = await getDraftsBySiteId(siteId);
        return res.status(200).json(drafts);
    } catch (e) {
        console.error('Error fetching drafts:', e);
        return res.status(500).json({ error: 'Failed to fetch drafts' });
    }
}

// POST /api/sites/:siteId/drafts - Create new draft
export async function createDraft(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const draftData = req.body as DraftPostModel;
        const draftWithSiteId = { ...draftData, site_id: siteId };
        const newDraft = await createDraftService(draftWithSiteId);
        return res.status(201).json(newDraft);
    } catch (e) {
        console.error('Error creating draft:', e);
        return res.status(500).json({ error: 'Failed to create draft' });
    }
}

// GET /api/sites/:siteId/drafts/:draftId - Get draft with all pages & sections
export async function getDraftById(req: Request, res: Response) {
    try {
        const { siteId, draftId } = req.params;
        const draft = await getDraftByIdService(draftId);
        if (draft && draft.site_id === siteId) {
            return res.status(200).json(draft);
        } else {
            return res.status(404).json({ message: 'Draft not found' });
        }
    } catch (e) {
        console.error('Error fetching draft:', e);
        return res.status(500).json({ error: 'Failed to fetch draft' });
    }
}

// PATCH /api/sites/:siteId/drafts/:draftId - Update draft metadata
export async function updateDraft(req: Request, res: Response) {
    try {
        const { siteId, draftId } = req.params;
        const updateData = req.body as Partial<DraftModel>;
        const updatedDraft = await updateDraftById(draftId, updateData);
        if (updatedDraft) {
            return res.status(200).json(updatedDraft);
        } else {
            return res.status(404).json({ message: 'Draft not found' });
        }
    } catch (e) {
        console.error('Error updating draft:', e);
        return res.status(500).json({ error: 'Failed to update draft' });
    }
}

// DELETE /api/sites/:siteId/drafts/:draftId - Delete draft
export async function deleteDraft(req: Request, res: Response) {
    try {
        const { siteId, draftId } = req.params;
        await deleteDraftById(draftId);
        return res.status(200).json({ message: 'Draft deleted successfully' });
    } catch (e) {
        console.error('Error deleting draft:', e);
        return res.status(500).json({ error: 'Failed to delete draft' });
    }
}