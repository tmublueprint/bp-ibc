import { db } from '../firebaseAdmin';
import { PublishedModel } from '../models/publishedModel';

const publishedCollection = db.collection('published');
const draftsCollection = db.collection('drafts');

// Publish current active draft for a site
export async function publishDraft(siteId: string): Promise<PublishedModel | null> {
    try {
        // Get active draft
        const draftSnapshot = await draftsCollection
            .where('site_id', '==', siteId)
            .where('is_active', '==', true)
            .limit(1)
            .get();

        if (draftSnapshot.empty) {
            return null;
        }

        const activeDraft = draftSnapshot.docs[0];
        const now = new Date();
        const version = (activeDraft.data().version || 0) + 1;

        // Create published version
        const documentRef = await publishedCollection.add({
            site_id: siteId,
            draft_id: activeDraft.id,
            version: version,
            is_current: true,
            published_at: now,
        });

        // Update previous published version to not current
        const prevPublishedSnapshot = await publishedCollection
            .where('site_id', '==', siteId)
            .where('is_current', '==', true)
            .where('version', '<', version)
            .get();

        const batch = db.batch();
        prevPublishedSnapshot.docs.forEach((doc) => {
            batch.update(doc.ref, { is_current: false });
        });
        batch.commit();

        const documentSnapshot = await documentRef.get();

        return {
            id: documentRef.id,
            site_id: documentSnapshot.data()!.site_id,
            draft_id: documentSnapshot.data()!.draft_id,
            version: documentSnapshot.data()!.version,
            is_current: documentSnapshot.data()!.is_current,
            published_at: documentSnapshot.data()!.published_at.toDate(),
        };
    } catch (error) {
        console.error('Error publishing draft:', error);
        throw error;
    }
}

// Get current published version for a site
export async function getPublishedBySiteId(siteId: string): Promise<PublishedModel | null> {
    try {
        const documentSnapshot = await publishedCollection
            .where('site_id', '==', siteId)
            .where('is_current', '==', true)
            .limit(1)
            .get();

        if (documentSnapshot.empty) {
            return null;
        }

        const doc = documentSnapshot.docs[0];

        return {
            id: doc.id,
            site_id: doc.data().site_id,
            draft_id: doc.data().draft_id,
            version: doc.data().version,
            is_current: doc.data().is_current,
            published_at: doc.data().published_at.toDate(),
        };
    } catch (error) {
        console.error('Error fetching published version:', error);
        throw error;
    }
}

// Get all published versions for a site
export async function getPublishedVersionsBySiteId(siteId: string): Promise<PublishedModel[]> {
    try {
        const snapshots = await publishedCollection
            .where('site_id', '==', siteId)
            .orderBy('version', 'desc')
            .get();

        const versions: PublishedModel[] = [];

        snapshots.forEach((doc) => {
            versions.push({
                id: doc.id,
                site_id: doc.data().site_id,
                draft_id: doc.data().draft_id,
                version: doc.data().version,
                is_current: doc.data().is_current,
                published_at: doc.data().published_at.toDate(),
            });
        });

        return versions;
    } catch (error) {
        console.error('Error fetching published versions:', error);
        throw error;
    }
}

// Get specific published version by ID
export async function getPublishedVersionById(versionId: string): Promise<PublishedModel | null> {
    try {
        const documentRef = publishedCollection.doc(versionId);
        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return {
            id: documentRef.id,
            site_id: documentSnapshot.data()!.site_id,
            draft_id: documentSnapshot.data()!.draft_id,
            version: documentSnapshot.data()!.version,
            is_current: documentSnapshot.data()!.is_current,
            published_at: documentSnapshot.data()!.published_at.toDate(),
        };
    } catch (error) {
        console.error('Error fetching published version:', error);
        throw error;
    }
}
