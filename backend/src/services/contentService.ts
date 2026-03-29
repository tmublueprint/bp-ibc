import { db } from '../firebaseAdmin';
import { ContentGetModel, ContentPostModel, ContentModel } from '../models/contentModel';

const contentsCollection = db.collection('contents');

function toContentModel(documentId: string, data: Record<string, any>): ContentGetModel {
    return {
        id: documentId,
        section_id: data.section_id,
        editable_id: data.editable_id,
        content: {
            text: data.content?.text,
            bold: data.content?.bold,
            italic: data.content?.italic,
            underline: data.content?.underline,
            alignment: data.content?.alignment,
            font: data.content?.font,
            size: data.content?.size,
        },
    };
}

export async function getContentsBySectionId(sectionId: string): Promise<ContentGetModel[]> {
    try {
        const snapshots = await contentsCollection.where('section_id', '==', sectionId).get();
        const docs = snapshots.docs as Array<{ id: string; data: () => Record<string, any> }>;

        return docs.map((doc) => toContentModel(doc.id, doc.data()));
    } catch (error) {
        console.error('Error fetching contents:', error);
        throw error;
    }
}

export async function getContentById(contentId: string): Promise<ContentGetModel | null> {
    try {
        const documentRef = contentsCollection.doc(contentId);
        const documentSnapshot = await documentRef.get();

        if (!documentSnapshot.exists) {
            return null;
        }

        return toContentModel(documentRef.id, documentSnapshot.data()!);
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
    }
}

export async function createContent(
    sectionId: string,
    contentData: ContentPostModel
): Promise<ContentGetModel> {
    try {
        const documentRef = await contentsCollection.add({
            section_id: sectionId,
            editable_id: contentData.editable_id,
            content: contentData.content,
        });

        const documentSnapshot = await documentRef.get();
        return toContentModel(documentRef.id, documentSnapshot.data()!);
    } catch (error) {
        console.error('Error creating content:', error);
        throw error;
    }
}

export async function updateContentById(
    contentId: string,
    updateData: Partial<ContentModel>
): Promise<ContentGetModel | null> {
    try {
        const documentRef = contentsCollection.doc(contentId);

        await documentRef.update(updateData);

        const documentSnapshot = await documentRef.get();
        if (!documentSnapshot.exists) {
            return null;
        }

        return toContentModel(documentRef.id, documentSnapshot.data()!);
    } catch (error) {
        console.error('Error updating content:', error);
        throw error;
    }
}

export async function deleteContentById(contentId: string): Promise<void> {
    try {
        await contentsCollection.doc(contentId).delete();
    } catch (error) {
        console.error('Error deleting content:', error);
        throw error;
    }
}
