export type PageSnapshot = Array<{ id: string; text: string; stylingUpdates: string; elementStyle?: string }>;

export interface PageGetModel {
    id: string;
    draft_id: string | null;
    published_version_id: string | null;
    page_name: string;
    page_number: number;
    content: PageSnapshot | null;
    created_at: Date;
}