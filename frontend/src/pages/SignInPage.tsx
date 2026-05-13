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
                <div className="input-field-container">
                    {/* username */}
                    <div className="input-container">
                        <p>Username:</p>
                        <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
                    </div>

                    {/* password */}
                    <div className="input-container">
                        <p>Password:</p>
                        <input type="password" onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                </div>

                {/* sign in button */}
                <div className="signin-button-container">
                    {error && <p className="signin-error">{error}</p>}
                    <Button handleClick={handleSignIn} variance="primary" borderRadius="27px" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SignInPage