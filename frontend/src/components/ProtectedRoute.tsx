import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../features/firebase/firebaseApp';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthenticated(!!user);
            setChecking(false);
        });
        return unsubscribe;
    }, []);

    if (checking) return null;
    if (!authenticated) return <Navigate to="/edit/signin" replace />;
    return <>{children}</>;
}

export default ProtectedRoute;
