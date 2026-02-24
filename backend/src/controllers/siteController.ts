import { Request, Response } from 'express';
import {
    getAllSites,
    getSiteById as getSiteByIdService,
    createNewSite,
    updateSiteById,
    deleteSiteById,
} from '../services/siteService';
import { SiteModel } from '../models/siteModel';

// GET /api/sites - List all sites for authenticated user
export async function getSites(req: Request, res: Response) {
    try {
        const userId = (req as any).uid; // From auth middleware
        const sites = await getAllSites(userId);
        return res.status(200).json(sites);
    } catch (e) {
        console.error('Error fetching sites:', e);
        return res.status(500).json({ error: 'Failed to fetch sites' });
    }
}

// POST /api/sites - Create new site
export async function createSite(req: Request, res: Response) {
    try {
        const userId = (req as any).uid;
        const siteData = req.body as Omit<SiteModel, 'id' | 'created_at' | 'updated_at'>;
        const newSite = await createNewSite(userId, siteData);
        return res.status(201).json(newSite);
    } catch (e) {
        console.error('Error creating site:', e);
        return res.status(500).json({ error: 'Failed to create site' });
    }
}

// GET /api/sites/:siteId - Get site details
export async function getSiteById(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const site = await getSiteByIdService(siteId);
        if (site) {
            return res.status(200).json(site);
        } else {
            return res.status(404).json({ message: 'Site not found' });
        }
    } catch (e) {
        console.error('Error fetching site:', e);
        return res.status(500).json({ error: 'Failed to fetch site' });
    }
}

// PATCH /api/sites/:siteId - Update site (name, domain)
export async function updateSite(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        const updateData = req.body as Partial<SiteModel>;
        const updatedSite = await updateSiteById(siteId, updateData);
        if (updatedSite) {
            return res.status(200).json(updatedSite);
        } else {
            return res.status(404).json({ message: 'Site not found' });
        }
    } catch (e) {
        console.error('Error updating site:', e);
        return res.status(500).json({ error: 'Failed to update site' });
    }
}

// DELETE /api/sites/:siteId - Delete site
export async function deleteSite(req: Request, res: Response) {
    try {
        const { siteId } = req.params;
        await deleteSiteById(siteId);
        return res.status(200).json({ message: 'Site deleted successfully' });
    } catch (e) {
        console.error('Error deleting site:', e);
        return res.status(500).json({ error: 'Failed to delete site' });
    }
}
