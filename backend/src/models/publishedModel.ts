export interface PublishedModel {
    id: string;
    site_id: string;
    draft_id: string;
    version: number;
    is_current: boolean;
    published_at: Date;
}