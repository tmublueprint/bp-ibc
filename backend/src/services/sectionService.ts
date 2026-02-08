import { db } from '../firebaseAdmin';
import { SectionPostModel, SectionGetModel } from '../models/sectionModel';

const sectionsCollection = db.collection('sections');

//Post
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
        styling: documentSnapshot.data()!.styling,
        section_num: documentSnapshot.data()!.section_num,
        created_at: documentSnapshot.data()!.created_at.toDate(),
        content: documentSnapshot.data()!.content,
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
        styling: documentSnapshot.data()!.styling,
        section_num: documentSnapshot.data()!.section_num,
        created_at: documentSnapshot.data()!.created_at.toDate(),
        content: documentSnapshot.data()!.content,
    };
    
}

// Get all
export async function getSections(): Promise<SectionGetModel[]> {
    const snapshots = await sectionsCollection.orderBy("created_at", "asc").get();
    const sections: SectionGetModel[] = [];
    
    snapshots.forEach((doc) => {
        const data = doc.data()!; 

        sections.push({
        id: doc.id,
        page_id: data.page_id,
        styling: data.styling,
        section_num: data.section_num,
        created_at: data.created_at,
        content: data.content,
        });
    });

    return sections;    
    }