import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ibc_logo from '../assets/navigation/logo.svg'
import { Button } from '../components/ui/Button';
import { authenticateUser } from '../features/firebase/firebaseAuth';
import './SignInPage.css'

function SignInPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!username || !password) {
            setError('Please enter your username and password.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await authenticateUser(username, password);
            navigate('/edit/1');
        } catch {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSignIn();
    };

    return (
        <div className="signin-page">
            <div className="signin-card">

                {/* logo */}
                <div className="signin-header">
                    <img src={ibc_logo} alt="ibc logo"/>
                    <div className="signin-title">
                        <h1>Itty Bitty<br />Critters</h1>
                        <h2 className="signin-admin-label">Admin Panel</h2>
                    </div>
                </div>

                {/* Input fields */}
                <form className="input-field-container" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                    <div className="input-container">
                        <label htmlFor="signin-username">Username:</label>
                        <input
                            id="signin-username"
                            type="text"
                            className={error ? 'input-error' : ''}
                            onChange={(e) => { setUsername(e.target.value); setError(null); }}
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="signin-password">Password:</label>
                        <input
                            id="signin-password"
                            type="password"
                            className={error ? 'input-error' : ''}
                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* error + sign in button */}
                    <div className="signin-button-container">
                        {error && (
                            <div className="signin-error" role="alert">
                                <span aria-hidden="true">⚠</span> {error}
                            </div>
                        )}
                        <Button handleClick={handleSignIn} variance="primary" borderRadius="27px" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignInPage