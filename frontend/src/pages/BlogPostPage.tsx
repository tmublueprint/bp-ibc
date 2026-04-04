import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { getPostBySlug } from '../services/blogService';
import type { BlogPost } from '../types/blog.types';
import { urlFor } from '../lib/sanityClient';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (slug: string) => {
    try {
      setLoading(true);
      const fetchedPost = await getPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        setError(null);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="blog-post-loading">Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <h2>{error || 'Post not found'}</h2>
        <button onClick={() => navigate('/blog')}>Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <button className="back-button" onClick={() => navigate('/blog')}>
        ← Back to Blog
      </button>

      <article className="blog-post">
        {post.mainImage && (
          <div className="blog-post-hero">
            <img
              src={urlFor(post.mainImage).width(1200).height(600).url()}
              alt={post.title}
            />
          </div>
        )}

        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            {post.author && <span className="author">By {post.author.name}</span>}
            <span className="date">{formatDate(post.publishedAt)}</span>
          </div>
          {post.categories && post.categories.length > 0 && (
            <div className="blog-post-categories">
              {post.categories.map((category: { _id: string; title: string }) => (
                <span key={category._id} className="category-tag">
                  {category.title}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-post-content">
          <PortableText value={post.body} />
        </div>
      </article>
    </div>
  );
}
