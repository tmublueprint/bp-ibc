import { Request, Response } from 'express';
import {
    createSection as createSectionService,
    getSectionById as getSectionByIdService,
    getSectionsByPageId,
    updateSectionById,
    deleteSectionById,
    reorderSectionsByPageId,
} from '../services/sectionService';
import { SectionModel, SectionPostModel } from '../models/sectionModel';

// GET /api/pages/:pageId/sections - Get all sections for a page
export async function getSections(req: Request, res: Response) {
    try {
        const { pageId } = req.params;
        const sections = await getSectionsByPageId(pageId);
        return res.status(200).json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return res.status(500).json({ message: 'Error fetching sections', error });
    }
}

// POST /api/pages/:pageId/sections - Create new section
export async function createSection(req: Request, res: Response) {
    try {
        const { pageId } = req.params;
        const sectionData = req.body as SectionPostModel;
        const sectionWithPageId = { ...sectionData, page_id: pageId };
        const newSection = await createSectionService(sectionWithPageId);
        return res.status(201).json(newSection);
    } catch (error) {
        console.error('Error creating section:', error);
        return res.status(500).json({ message: 'Error creating section', error });
    }
}

// GET /api/pages/:pageId/sections/:sectionId - Get section with content
export async function getSection(req: Request, res: Response) {
    try {
        const { pageId, sectionId } = req.params;
        const section = await getSectionByIdService(sectionId);
        if (section && section.page_id === pageId) {
            return res.status(200).json(section);
        } else {
            return res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Error fetching section:', error);
        return res.status(500).json({ error: 'Failed to fetch section' });
    }
}

// PATCH /api/pages/:pageId/sections/:sectionId - Update section
export async function updateSection(req: Request, res: Response) {
    try {
        const { pageId, sectionId } = req.params;
        const updateData = req.body as Partial<SectionModel>;
        const updatedSection = await updateSectionById(sectionId, updateData);
        if (updatedSection) {
            return res.status(200).json(updatedSection);
        } else {
            return res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Error updating section:', error);
        return res.status(500).json({ error: 'Failed to update section' });
    }
}

// DELETE /api/pages/:pageId/sections/:sectionId - Delete section
export async function deleteSection(req: Request, res: Response) {
    try {
        const { pageId, sectionId } = req.params;
        await deleteSectionById(sectionId);
        return res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        console.error('Error deleting section:', error);
        return res.status(500).json({ error: 'Failed to delete section' });
    }
}

// PATCH /api/pages/:pageId/sections/reorder - Reorder sections (bulk update section_number)
export async function reorderSections(req: Request, res: Response) {
    try {
        const { pageId } = req.params;
        const { sections } = req.body as { sections: Array<{ id: string; section_number: number }> };
        const updatedSections = await reorderSectionsByPageId(pageId, sections);
        return res.status(200).json(updatedSections);
    } catch (error) {
        console.error('Error reordering sections:', error);
        return res.status(500).json({ error: 'Failed to reorder sections' });
    }
}