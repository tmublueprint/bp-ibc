import { db } from '../firebaseAdmin';
import { SectionPostModel, SectionGetModel, SectionModel } from '../models/sectionModel';

const sectionsCollection = db.collection('sections');

// Get all sections for a page
export async function getSectionsByPageId(pageId: string): Promise<SectionGetModel[]> {
    try {
        const snapshots = await sectionsCollection.where('page_id', '==', pageId).orderBy('section_number', 'asc').get();
        const sections: SectionGetModel[] = [];

        snapshots.forEach((doc) => {
            sections.push({
                id: doc.id,
                page_id: doc.data().page_id,
                section_number: doc.data().section_number,
                created_at: doc.data().created_at.toDate(),
            });
        });

        return sections;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
}

//Post - Create section
export async function createSection(sectionData: SectionPostModel): Promise<SectionGetModel> {
    const now = new Date();

    const documentRef = await sectionsCollection.add({
        ...sectionData,
        created_at: now,
    });

    const documentSnapshot = await documentRef.get();

    return {
        id: documentRef.id,
        page_id: documentSnapshot.data()!.page_id,
        section_number: documentSnapshot.data()!.section_number,
        created_at: documentSnapshot.data()!.created_at.toDate(),
    };
}

//Get one
export async function getSectionById(sectionId: string): Promise<SectionGetModel | null> {
    const documentRef = sectionsCollection.doc(sectionId);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
        return null;
    }

    return {
        id: documentRef.id,
        page_id: documentSnapshot.data()!.page_id,
        section_number: documentSnapshot.data()!.section_number,
        created_at: documentSnapshot.data()!.created_at.toDate(),
    };
}

// Update section by ID
export async function updateSectionById(sectionId: string, updateData: Partial<SectionModel>): Promise<SectionGetModel | null> {
    try {
        const documentRef = sectionsCollection.doc(sectionId);

        await documentRef.update(updateData);

        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return {
            id: documentRef.id,
            page_id: documentSnapshot.data()!.page_id,
            section_number: documentSnapshot.data()!.section_number,
            created_at: documentSnapshot.data()!.created_at.toDate(),
        };
    } catch (error) {
        console.error('Error updating section:', error);
        throw error;
    }
}

// Delete section by ID
export async function deleteSectionById(sectionId: string): Promise<void> {
    try {
        await sectionsCollection.doc(sectionId).delete();
    } catch (error) {
        console.error('Error deleting section:', error);
        throw error;
    }
}

// Reorder sections for a page (bulk update)
export async function reorderSectionsByPageId(pageId: string, sections: Array<{ id: string; section_number: number }>): Promise<SectionGetModel[]> {
    try {
        const batch = db.batch();

        sections.forEach((section) => {
            const docRef = sectionsCollection.doc(section.id);
            batch.update(docRef, { section_number: section.section_number });
        });

        await batch.commit();

        return getSectionsByPageId(pageId);
    } catch (error) {
        console.error('Error reordering sections:', error);
        throw error;
    }
}

// Get all (legacy - keeping for backwards compatibility)
export async function getSections(): Promise<SectionGetModel[]> {
    const snapshots = await sectionsCollection.orderBy("created_at", "asc").get();
    const sections: SectionGetModel[] = [];

    snapshots.forEach((doc) => {
        const data = doc.data()!;

        sections.push({
            id: doc.id,
            page_id: data.page_id,
            section_number: data.section_number,
            created_at: data.created_at.toDate(),
        });
    });

    return sections;
}