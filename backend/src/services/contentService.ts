import { db } from '../firebaseAdmin';
import { ContentPostModel, ContentGetModel } from '../models/contentModel';

const contentCollection = db.collection('content');

// Post
export async function createContent(contentData: ContentPostModel): Promise<ContentGetModel> {
    const documentRef = await contentCollection.add({
        ...contentData,
    });

    const documentSnapshot = await documentRef.get();

    return {
        id: documentRef.id,
        section_id: documentSnapshot.data()!.section_id,
        content: documentSnapshot.data()!.content,
    };
}

// Get one
export async function getContentById(contentId: string): Promise<ContentGetModel | null> {
    const documentRef = contentCollection.doc(contentId);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
        return null;
    }

    return {
        id: documentRef.id,
        section_id: documentSnapshot.data()!.section_id,
        content: documentSnapshot.data()!.content,
    };
}

// Get all
export async function getContents(): Promise<ContentGetModel[]> {
    const snapshots = await contentCollection.get();
    const contents: ContentGetModel[] = [];

    snapshots.forEach((doc) => {
        const data = doc.data()!;

        contents.push({
            id: doc.id,
            section_id: data.section_id,
            content: data.content,
        });
    });

    return contents;
}