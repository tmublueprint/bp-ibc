import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppRoutes from '../../Route';

vi.mock('../../pages/SignInPage', () => ({ default: () => <div>Sign In Page</div> }));
vi.mock('../../pages/HomePage', () => ({ default: () => <div>Home Page</div> }));
vi.mock('../../pages/AboutPage', () => ({ default: () => <div>About Page</div> }));
vi.mock('../../pages/EducationPage', () => ({ default: () => <div>Education Page</div> }));
vi.mock('../../pages/VolunteerPage', () => ({ default: () => <div>Volunteer Page</div> }));
vi.mock('../../pages/BlogPage', () => ({ default: () => <div>Blog Page</div> }));
vi.mock('../../pages/BlogPostPage', () => ({ default: () => <div>Blog Post Page</div> }));
vi.mock('../../pages/EditorPage', () => ({ default: () => <div>Editor Page</div> }));
vi.mock('../../App', () => ({ default: () => <div>Template Library</div> }));

afterEach(() => {
  cleanup();
});

describe('AppRoutes', () => {
  it.each([
    ['/home', 'Home Page'],
    ['/about', 'About Page'],
    ['/education', 'Education Page'],
    ['/volunteer', 'Volunteer Page'],
    ['/edit/signin', 'Sign In Page'],
    ['/edit/123', 'Editor Page'],
    ['/blog', 'Blog Page'],
    ['/blog/sample-post', 'Blog Post Page'],
  ])('renders %s route', (path, expectedText) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('redirects root path to /home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders nested /edit route index page', () => {
    render(
      <MemoryRouter initialEntries={['/edit']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Template Library')).toBeInTheDocument();
  });

  it('renders wildcard route for unknown pages', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});