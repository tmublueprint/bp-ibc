export interface BlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  author?: {
    name: string;
    image?: any;
  };
  mainImage?: any;
  categories?: Array<{
    _id: string;
    title: string;
    description?: string;
  }>;
  publishedAt: string;
  body: any[];
}

export interface Category {
  _id: string;
  title: string;
  description?: string;
}
