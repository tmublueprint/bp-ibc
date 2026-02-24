export interface PageGetModel {
    id: string;
    draft_id: string | null;
    published_version_id: string | null;
    page_name: string;
    page_number: number;
    created_at: Date;
}