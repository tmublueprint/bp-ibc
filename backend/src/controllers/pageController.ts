import { Request, Response } from 'express';
import {
  getPagesBydraftId,
  getPageById as getPageByIdService,
  createNewPage,
  updatePageById,
  deletePageById,
} from '../services/pageService';
import { PageGetModel } from '../models/pageModel';

// GET /api/drafts/:draftId/pages - Get all pages in draft
export async function getPages(req: Request, res: Response) {
  try {
    const { draftId } = req.params;
    const pages = await getPagesBydraftId(draftId);
    return res.status(200).json(pages);
  } catch (e) {
    console.error('Error fetching pages:', e);
    return res.status(500).json({ error: 'Failed to fetch pages' });
  }
}

// POST /api/drafts/:draftId/pages - Create new page
export async function createPage(req: Request, res: Response) {
  try {
    const { draftId } = req.params;
    const pageData = req.body as Omit<PageGetModel, 'id' | 'created_at'>;
    const newPage = await createNewPage(draftId, pageData);
    return res.status(201).json(newPage);
  } catch (e) {
    console.error('Error creating page:', e);
    return res.status(500).json({ error: 'Failed to create page' });
  }
}

// GET /api/drafts/:draftId/pages/:pageId - Get single page with sections
export async function getPageById(req: Request, res: Response) {
  try {
    const { draftId, pageId } = req.params;
    const page = await getPageByIdService(pageId);
    if (page && page.draft_id === draftId) {
      return res.status(200).json(page);
    } else {
      return res.status(404).json({ message: 'Page not found' });
    }
  } catch (e) {
    console.error('Error fetching page:', e);
    return res.status(500).json({ error: 'Failed to fetch page' });
  }
}

// PATCH /api/drafts/:draftId/pages/:pageId - Update page
export async function updatePage(req: Request, res: Response) {
  try {
    const { draftId, pageId } = req.params;
    const updateData = req.body as Partial<PageGetModel>;
    const updatedPage = await updatePageById(pageId, updateData);
    if (updatedPage) {
      return res.status(200).json(updatedPage);
    } else {
      return res.status(404).json({ message: 'Page not found' });
    }
  } catch (e) {
    console.error('Error updating page:', e);
    return res.status(500).json({ error: 'Failed to update page' });
  }
}

// DELETE /api/drafts/:draftId/pages/:pageId - Delete page
export async function deletePage(req: Request, res: Response) {
  try {
    const { draftId, pageId } = req.params;
    await deletePageById(pageId);
    return res.status(200).json({ message: 'Page deleted successfully' });
  } catch (e) {
    console.error('Error deleting page:', e);
    return res.status(500).json({ error: 'Failed to delete page' });
  }
}

