import { NavLink } from "react-router-dom"
import './Navbar.css';
import ibc_logo from '/src/assets/navigation/logo.svg'

function Navbar() {
    return (
        <nav>
            <div className="logo" style={{display: 'flex', fontFamily: 'DM Sans, sans-serif'}}>
                <img src={ibc_logo} alt="ibc logo"/>
                <div>
                    <h1>Itty Bitty</h1>
                    <h1>Critters</h1>
                </div>
            </div>
            <div className="navlinks" style={{fontFamily: 'DM Sans, sans-serif'}}>
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"}>About</NavLink>
                <NavLink to="/education" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"}>Education</NavLink>
                <NavLink to="/volunteer" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"}>Volunteer</NavLink>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-a active" : "nav-a"}>Contact</NavLink>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-a active log-in" : "nav-a log-in"}>Log in</NavLink>
            </div>
        </nav>
    );
}

export default Navbar;