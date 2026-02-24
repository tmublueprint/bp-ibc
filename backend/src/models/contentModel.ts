export interface ContentModel {
    id: string;
    section_id: string;
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