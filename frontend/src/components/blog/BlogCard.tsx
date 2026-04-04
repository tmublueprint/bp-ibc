import { useEffect, useState } from 'react';
import type { BlogPost } from '../../types/blog.types';
import { urlFor } from '../../lib/sanityClient';
import './BlogCard.css';

interface BlogCardProps {
  post: BlogPost;
  onClick: (slug: string) => void;
}

export default function BlogCard({ post, onClick }: BlogCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (post.mainImage) {
      setImageUrl(urlFor(post.mainImage).width(400).height(250).url());
    }
  }, [post.mainImage]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="blog-card" onClick={() => onClick(post.slug.current)}>
      {imageUrl && (
        <div className="blog-card-image">
          <img src={imageUrl} alt={post.title} />
        </div>
      )}
      <div className="blog-card-content">
        <h3 className="blog-card-title">{post.title}</h3>
        <div className="blog-card-meta">
          {post.author && <span className="blog-card-author">{post.author.name}</span>}
          <span className="blog-card-date">{formatDate(post.publishedAt)}</span>
        </div>
        {post.categories && post.categories.length > 0 && (
          <div className="blog-card-tags">
            {post.categories.map((category) => (
              <span key={category._id} className="blog-tag">
                {category.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
