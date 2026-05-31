import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../features/firebase/firebaseApp';

function ProtectedRoute({ children, requireAuth = true }: { children: React.ReactNode; requireAuth?: boolean }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthenticated(!!user);
            setChecking(false);
        });
        return unsubscribe;
    }, []);

    if (checking) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#1E2E5E' }}>
                Loading…
            </div>
        );
    }

    // Used on /edit/signin — redirect away if already logged in
    if (!requireAuth && authenticated) return <Navigate to="/edit/1" replace />;

    // Used on protected routes — redirect to sign in if not logged in
    if (requireAuth && !authenticated) return <Navigate to="/edit/signin" replace />;

    return <>{children}</>;
}

export default ProtectedRoute;
