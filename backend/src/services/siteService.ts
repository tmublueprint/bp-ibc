import { db } from '../firebaseAdmin';
import { SiteModel } from '../models/siteModel';

const sitesCollection = db.collection('sites');

// Get all sites for a user
export async function getAllSites(userId: string): Promise<SiteModel[]> {
    try {
        const snapshots = await sitesCollection.where('user_id', '==', userId).get();
        const sites: SiteModel[] = [];

        snapshots.forEach((doc) => {
            sites.push({
                id: doc.id,
                site_name: doc.data().site_name,
                domain: doc.data().domain,
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
            });
        });

        return sites;
    } catch (error) {
        console.error('Error fetching sites:', error);
        throw error;
    }
}

// Get site by ID
export async function getSiteById(siteId: string): Promise<SiteModel | null> {
    try {
        const documentRef = sitesCollection.doc(siteId);
        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return {
            id: documentRef.id,
            site_name: documentSnapshot.data()!.site_name,
            domain: documentSnapshot.data()!.domain,
            created_at: documentSnapshot.data()!.created_at.toDate(),
            updated_at: documentSnapshot.data()!.updated_at.toDate(),
        };
    } catch (error) {
        console.error('Error fetching site:', error);
        throw error;
    }
}

// Create new site
export async function createNewSite(userId: string, siteData: Omit<SiteModel, 'id' | 'created_at' | 'updated_at'>): Promise<SiteModel> {
    try {
        const now = new Date();
        const documentRef = await sitesCollection.add({
            user_id: userId,
            site_name: siteData.site_name,
            domain: siteData.domain,
            created_at: now,
            updated_at: now,
        });

        const documentSnapshot = await documentRef.get();

        return {
            id: documentRef.id,
            site_name: documentSnapshot.data()!.site_name,
            domain: documentSnapshot.data()!.domain,
            created_at: documentSnapshot.data()!.created_at.toDate(),
            updated_at: documentSnapshot.data()!.updated_at.toDate(),
        };
    } catch (error) {
        console.error('Error creating site:', error);
        throw error;
    }
}

// Update site
export async function updateSiteById(siteId: string, updateData: Partial<SiteModel>): Promise<SiteModel | null> {
    try {
        const documentRef = sitesCollection.doc(siteId);
        const now = new Date();

        await documentRef.update({
            ...updateData,
            updated_at: now,
        });

        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return {
            id: documentRef.id,
            site_name: documentSnapshot.data()!.site_name,
            domain: documentSnapshot.data()!.domain,
            created_at: documentSnapshot.data()!.created_at.toDate(),
            updated_at: documentSnapshot.data()!.updated_at.toDate(),
        };
    } catch (error) {
        console.error('Error updating site:', error);
        throw error;
    }
}

// Delete site
export async function deleteSiteById(siteId: string): Promise<void> {
    try {
        await sitesCollection.doc(siteId).delete();
    } catch (error) {
        console.error('Error deleting site:', error);
        throw error;
    }
}
