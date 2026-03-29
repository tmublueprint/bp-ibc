import { Request, Response } from 'express';
import {
    getContentsBySectionId,
    getContentById,
    createContent,
    updateContentById,
    deleteContentById,
} from '../services/contentService';
import { ContentPostModel, ContentModel } from '../models/contentModel';

function hasValidEditableId(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

// GET /api/sections/:sectionId/contents - List all content blocks for a section
export async function getContents(req: Request, res: Response) {
    try {
        const { sectionId } = req.params;
        const contents = await getContentsBySectionId(sectionId);
        return res.status(200).json(contents);
    } catch (error) {
        console.error('Error fetching contents:', error);
        return res.status(500).json({ error: 'Failed to fetch contents' });
    }
}

// POST /api/sections/:sectionId/contents - Create content block with stable editable_id
export async function createContentBlock(req: Request, res: Response) {
    try {
        const { sectionId } = req.params;
        const contentData = req.body as ContentPostModel;

        if (!hasValidEditableId(contentData.editable_id)) {
            return res.status(400).json({ message: 'editable_id is required' });
        }

        const newContent = await createContent(sectionId, contentData);
        return res.status(201).json(newContent);
    } catch (error) {
        console.error('Error creating content:', error);
        return res.status(500).json({ error: 'Failed to create content' });
    }
}

// GET /api/sections/:sectionId/contents/:contentId - Get single content block
export async function getContent(req: Request, res: Response) {
    try {
        const { sectionId, contentId } = req.params;
        const content = await getContentById(contentId);

        if (!content || content.section_id !== sectionId) {
            return res.status(404).json({ message: 'Content not found' });
        }

        return res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        return res.status(500).json({ error: 'Failed to fetch content' });
    }
}

// PATCH /api/sections/:sectionId/contents/:contentId - Update content block
export async function updateContent(req: Request, res: Response) {
    try {
        const { sectionId, contentId } = req.params;
        const updateData = req.body as Partial<ContentModel>;

        if (
            Object.prototype.hasOwnProperty.call(updateData, 'editable_id') &&
            !hasValidEditableId(updateData.editable_id)
        ) {
            return res.status(400).json({ message: 'editable_id cannot be empty' });
        }

        const existing = await getContentById(contentId);
        if (!existing || existing.section_id !== sectionId) {
            return res.status(404).json({ message: 'Content not found' });
        }

        const updatedContent = await updateContentById(contentId, updateData);
        return res.status(200).json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        return res.status(500).json({ error: 'Failed to update content' });
    }
}

// DELETE /api/sections/:sectionId/contents/:contentId - Delete content block
export async function deleteContent(req: Request, res: Response) {
    try {
        const { sectionId, contentId } = req.params;
        const existing = await getContentById(contentId);

        if (!existing || existing.section_id !== sectionId) {
            return res.status(404).json({ message: 'Content not found' });
        }

        await deleteContentById(contentId);
        return res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        return res.status(500).json({ error: 'Failed to delete content' });
    }
}
