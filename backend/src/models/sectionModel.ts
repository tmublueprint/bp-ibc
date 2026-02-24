export interface SectionModel {
  id: string;
  page_id: string;
  section_number: number;
  created_at: Date;
}

export type SectionGetModel = SectionModel;

export type SectionPostModel = Omit<SectionModel, 'id' | 'created_at'>;
