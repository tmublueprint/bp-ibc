import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, getAllCategories, getPostsByCategory } from '../services/blogService';
import type { BlogPost, Category } from '../types/blog.types';
import BlogCard from '../components/blog/BlogCard';
import './BlogPage.css';

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadPosts = async (categoryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = categoryId
        ? await getPostsByCategory(categoryId)
        : await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Unable to load blog posts. Please check your connection or try again.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    loadPosts(selectedCategory || undefined);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    loadPosts(categoryId || undefined);
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Insights, stories, and updates from our community</p>
      </div>

      {/* Category Filter */}
      {!error && categories.length > 0 && (
        <div className="blog-filters">
          <button
            className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(null)}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className={`filter-btn ${selectedCategory === category._id ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category._id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* Blog Posts Feed */}
      {loading ? (
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div className="blog-error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="blog-empty-container">
          <div className="empty-icon">📝</div>
          <h2>No posts yet</h2>
          <p>Check back soon for new content!</p>
        </div>
      ) : (
        <div className="blog-feed">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} onClick={handlePostClick} />
          ))}
        </div>
      )}
    </div>
  );
}
