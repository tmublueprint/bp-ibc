export interface StylingEvent {
    idx: number;
    style: string;
    val?: string | null;
}

export interface ContentBody {
    text: string;
    styling_events: StylingEvent[];
}

export interface ContentPostModel {
    section_id: string;
    content: ContentBody;
}

export interface ContentGetModel {
    id: string;
    section_id: string;
    content: ContentBody;
}