import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ibc_logo from '../assets/navigation/logo.svg'
import './SignInPage.css'

interface SignInCredentials {
    username: string;
    password: string;
}

function SignInPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = ({ username, password }: SignInCredentials) => {
        // TODO: Implement actual authentication logic here & handle errors
        console.log("Signing in with credentials:", { username, password });
        navigate('/edit');
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
                <button className="signin-button" onClick={() => handleSignIn({ username, password })}>
                    Sign In
                </button>
            </div>
        </div>
    )
}

export default SignInPage