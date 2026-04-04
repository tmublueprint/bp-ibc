import { client } from '../lib/sanityClient';
import type { BlogPost, Category } from '../types/blog.types';

export async function getAllPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    categories[]->{
      _id,
      title,
      description
    },
    publishedAt,
    body
  }`;
  
  return await client.fetch(query);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    categories[]->{
      _id,
      title,
      description
    },
    publishedAt,
    body
  }`;
  
  return await client.fetch(query, { slug });
}

// Fetch posts by category
export async function getPostsByCategory(categoryId: string): Promise<BlogPost[]> {
  const query = `*[_type == "post" && $categoryId in categories[]._ref] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    categories[]->{
      _id,
      title,
      description
    },
    publishedAt,
    body
  }`;
  
  return await client.fetch(query, { categoryId });
}

// Fetch all categories
export async function getAllCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    description
  }`;
  
  return await client.fetch(query);
}
