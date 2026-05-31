import { NavLink } from "react-router-dom"
import './Navbar.css';
import ibc_logo from '../../../assets/navigation/logo.svg'
import { useState } from 'react';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const close = () => setMenuOpen(false);

    return (
        <nav>
            <div className="logo" style={{display: 'flex', fontFamily: 'DM Sans, sans-serif'}}>
                <img src={ibc_logo} alt="ibc logo"/>
                <div>
                    <h1>Itty Bitty</h1>
                    <h1>Critters</h1>
                </div>
            </div>
            <div className={`navlinks${menuOpen ? ' navlinks--open' : ''}`} style={{fontFamily: 'DM Sans, sans-serif'}}>
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>About</NavLink>
                <NavLink to="/education" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>Education</NavLink>
                <NavLink to="/volunteer" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>Volunteer</NavLink>
                <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>Blog</NavLink>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"} onClick={close}>Contact</NavLink>
            </div>
            <button
                className="nav-hamburger"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
                {menuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                )}
            </button>
        </nav>
    );
}

export default Navbar;
