export interface SectionModel {
  id: string;
  page_id: string;
  section_num: number;
  styling: string;
  content: Record<string, any>;
}

export interface SectionGetModel {
  id: string;                       
  page_id: string;
  styling: string;
  section_num: number;
  created_at: Date;                   
  content: Record<string, any>;
}
