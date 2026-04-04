import { db } from "../firebaseAdmin";
import { DraftGetModel, DraftPostModel } from "../models/draftModel";

const draftsCollection = db.collection('drafts');

// Get all drafts for a site
export async function getDraftsBySiteId(siteId: string): Promise<DraftGetModel[]> {
    try {
        const snapshots = await draftsCollection.where('site_id', '==', siteId).get();
        const drafts: DraftGetModel[] = [];

        snapshots.forEach((doc) => {
            drafts.push({
                id: doc.id,
                site_id: doc.data().site_id,
                version: doc.data().version,
                is_active: doc.data().is_active,
                created_at: doc.data().created_at.toDate(),
                updated_at: doc.data().updated_at.toDate(),
            });
        });

        return drafts;
    } catch (error) {
        console.error('Error fetching drafts:', error);
        throw error;
    }
}

//Get one draft
export async function getDraftById(id: string): Promise<DraftGetModel | null> {
    const documentRef = draftsCollection.doc(id);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
        return null;
    }

    return {
        id: documentRef.id,
        site_id: documentSnapshot.data()!.site_id,
        version: documentSnapshot.data()!.version,
        is_active: documentSnapshot.data()!.is_active,
        created_at: documentSnapshot.data()!.created_at.toDate(),
        updated_at: documentSnapshot.data()!.updated_at.toDate(),
    };
}

//Post draft
export async function createDraft(draftData: DraftPostModel): Promise<DraftGetModel> {

    const date = new Date();

    const documentRef = await draftsCollection.add({
        created_at: date,
        updated_at: date,
        ...draftData
    });

    const documentSnapshot = await documentRef.get();

    return {
        id: documentRef.id,
        site_id: documentSnapshot.data()!.site_id,
        version: documentSnapshot.data()!.version,
        is_active: documentSnapshot.data()!.is_active,
        created_at: documentSnapshot.data()!.created_at.toDate(),
        updated_at: documentSnapshot.data()!.updated_at.toDate(),
    };
}

// Update draft by ID
export async function updateDraftById(draftId: string, updateData: Partial<DraftGetModel>): Promise<DraftGetModel | null> {
    try {
        const documentRef = draftsCollection.doc(draftId);
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
            site_id: documentSnapshot.data()!.site_id,
            version: documentSnapshot.data()!.version,
            is_active: documentSnapshot.data()!.is_active,
            created_at: documentSnapshot.data()!.created_at.toDate(),
            updated_at: documentSnapshot.data()!.updated_at.toDate(),
        };
    } catch (error) {
        console.error('Error updating draft:', error);
        throw error;
    }
}

// Delete draft by ID
export async function deleteDraftById(draftId: string): Promise<void> {
    try {
        await draftsCollection.doc(draftId).delete();
    } catch (error) {
        console.error('Error deleting draft:', error);
        throw error;
    }
}