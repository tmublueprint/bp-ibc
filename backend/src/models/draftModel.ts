export interface DraftModel {
    id: string;
    site_id: string;
    version: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export type DraftGetModel = DraftModel;

export type DraftPostModel = Omit<DraftModel, 'id' | 'created_at' | 'updated_at'>;