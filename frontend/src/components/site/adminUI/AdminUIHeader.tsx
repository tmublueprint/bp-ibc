import './AdminUIHeader.css';
import eye_icon from '../../../assets/adminUI/Eye.svg';
import check_icon from '../../../assets/adminUI/Check.svg';


function AdminUIHeader() {
    return (
        <header className="admin-header" style={{fontFamily: 'DM Sans, sans-serif'}}>
            <h1 className="admin-header-h1">Hi, Kelly! You're editing pages now.</h1>
            <div className="buttons-container">
                <button className="admin-header-button">
                    <img src={eye_icon} alt=""></img>
                    <span>Preview Site</span>
                </button>
                <button className="admin-header-button">
                    <img src={check_icon} alt=""></img>
                    <span>Apply Changes</span>
                </button>
            </div>
        </header>

    );
}

export default AdminUIHeader;