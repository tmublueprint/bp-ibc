export interface ContentModel {
    id: string;
    section_id: string;
    editable_id: string;
    content: {
        text?: string;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        alignment?: string;
        font: string;
        size: number;
    };
}

export type ContentGetModel = ContentModel;

export type ContentPostModel = Omit<ContentModel, 'id' | 'section_id'>;