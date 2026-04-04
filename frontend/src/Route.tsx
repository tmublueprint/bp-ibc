import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EducationPage from './pages/EducationPage';
import VolunteerPage from './pages/VolunteerPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import App from './App';
import EditorPage from './pages/EditorPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/edit">
                <Route index element={<App />} />
                <Route path="signin" element={<SignInPage />} />
                <Route path=":id" element={<EditorPage />} />
            </Route>
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
}