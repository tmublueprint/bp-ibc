import { db } from '../firebaseAdmin';
import { PageGetModel } from '../models/pageModel';

const pagesCollection = db.collection('pages');
const sectionsCollection = db.collection('sections');
const contentsCollection = db.collection('contents');

function getFallbackEditableId(sectionId: string, contentId: string) {
    return `section:${sectionId}:content:${contentId}`;
}

async function getEditableElementsForPage(pageId: string) {
    const sectionSnapshots = await sectionsCollection.where('page_id', '==', pageId).get();

    if (sectionSnapshots.empty) {
        return [];
    }

    const sectionIds = sectionSnapshots.docs.map((sectionDoc) => sectionDoc.id);

    const editableElementsBySection = await Promise.all(
        sectionIds.map(async (sectionId) => {
            const contentSnapshots = await contentsCollection.where('section_id', '==', sectionId).get();

            if (contentSnapshots.empty) {
                return [];
            }

            const updates: Array<Promise<FirebaseFirestore.WriteResult>> = [];

            const mapped = contentSnapshots.docs
                .map((contentDoc) => {
                    const contentData = contentDoc.data() as {
                        id?: string;
                        db_id?: string;
                        dbId?: string;
                        editable_id?: string;
                        editableId?: string;
                        content?: { text?: unknown };
                        text?: unknown;
                    };

                    const textValue =
                        typeof contentData.content?.text === 'string'
                            ? contentData.content.text
                            : typeof contentData.text === 'string'
                                ? contentData.text
                                : null;

                    if (textValue === null) {
                        return null;
                    }

                    const fallbackEditableId = getFallbackEditableId(sectionId, contentDoc.id);
                    const normalizedEditableId =
                        contentData.editable_id ??
                        contentData.editableId ??
                        contentData.db_id ??
                        contentData.dbId ??
                        contentData.id ??
                        fallbackEditableId;

                    if (
                        !contentData.editable_id &&
                        !contentData.editableId &&
                        typeof normalizedEditableId === 'string' &&
                        normalizedEditableId.length
                    ) {
                        updates.push(contentDoc.ref.update({ editable_id: normalizedEditableId }));
                    }

                    return {
                        id: normalizedEditableId,
                        text: textValue,
                        section_id: sectionId,
                    };
                })
                .filter((value): value is { id: string; text: string; section_id: string } => value !== null);

            if (updates.length) {
                await Promise.all(updates);
            }

            return mapped;
        })
    );

    return editableElementsBySection.flat();
}

// Get all pages for a draft
export async function getPagesBydraftId(draftId: string): Promise<PageGetModel[]> {
    try {
        const snapshots = await pagesCollection.where('draft_id', '==', draftId).get();

        return Promise.all(
            snapshots.docs.map(async (doc) => {
                const editable_elements = await getEditableElementsForPage(doc.id);

                return {
                    id: doc.id,
                    draft_id: doc.data().draft_id,
                    published_version_id: doc.data().published_version_id || null,
                    page_name: doc.data().page_name,
                    page_number: doc.data().page_number,
                    created_at: doc.data().created_at.toDate(),
                    editable_elements,
                };
            })
        );
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

    const editable_elements = await getEditableElementsForPage(documentRef.id);

    return {
        id: documentRef.id,
        draft_id: documentSnapshot.data()!.draft_id,
        published_version_id: documentSnapshot.data()!.published_version_id || null,
        page_name: documentSnapshot.data()!.page_name,
        page_number: documentSnapshot.data()!.page_number,
        created_at: documentSnapshot.data()!.created_at.toDate(),
        editable_elements,
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