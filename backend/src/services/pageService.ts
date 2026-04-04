import { db } from '../firebaseAdmin';
import { PageGetModel } from '../models/pageModel';

const pagesCollection = db.collection('pages');

// Get all pages for a draft
export async function getPagesBydraftId(draftId: string): Promise<PageGetModel[]> {
    try {
        const snapshots = await pagesCollection.where('draft_id', '==', draftId).get();
        const pages: PageGetModel[] = [];

        snapshots.forEach((doc) => {
            pages.push({
                id: doc.id,
                draft_id: doc.data().draft_id,
                published_version_id: doc.data().published_version_id || null,
                page_name: doc.data().page_name,
                page_number: doc.data().page_number,
                created_at: doc.data().created_at.toDate(),
            });
        });

        return pages;
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }
}

// get one page
export async function getPageById(id: string): Promise<PageGetModel | null> {

    const documentRef = pagesCollection.doc(id);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
        return null;
    }

    return {
        id: documentRef.id,
        draft_id: documentSnapshot.data()!.draft_id,
        published_version_id: documentSnapshot.data()!.published_version_id || null,
        page_name: documentSnapshot.data()!.page_name,
        page_number: documentSnapshot.data()!.page_number,
        created_at: documentSnapshot.data()!.created_at.toDate(),
    };
}

// Create new page
export async function createNewPage(draftId: string, pageData: Omit<PageGetModel, 'id' | 'created_at'>): Promise<PageGetModel> {
    try {
        const now = new Date();
        const documentRef = await pagesCollection.add({
            draft_id: draftId,
            page_name: pageData.page_name,
            page_number: pageData.page_number,
            published_version_id: pageData.published_version_id || null,
            created_at: now,
        });

        const documentSnapshot = await documentRef.get();

        return {
            id: documentRef.id,
            draft_id: documentSnapshot.data()!.draft_id,
            published_version_id: documentSnapshot.data()!.published_version_id || null,
            page_name: documentSnapshot.data()!.page_name,
            page_number: documentSnapshot.data()!.page_number,
            created_at: documentSnapshot.data()!.created_at.toDate(),
        };
    } catch (error) {
        console.error('Error creating page:', error);
        throw error;
    }
}

// Update page by ID
export async function updatePageById(pageId: string, updateData: Partial<PageGetModel>): Promise<PageGetModel | null> {
    try {
        const documentRef = pagesCollection.doc(pageId);

        await documentRef.update(updateData);

        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return {
            id: documentRef.id,
            draft_id: documentSnapshot.data()!.draft_id,
            published_version_id: documentSnapshot.data()!.published_version_id || null,
            page_name: documentSnapshot.data()!.page_name,
            page_number: documentSnapshot.data()!.page_number,
            created_at: documentSnapshot.data()!.created_at.toDate(),
        };
    } catch (error) {
        console.error('Error updating page:', error);
        throw error;
    }
}

// Delete page by ID
export async function deletePageById(pageId: string): Promise<void> {
    try {
        await pagesCollection.doc(pageId).delete();
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
}