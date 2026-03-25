import './AdminUINavbar.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../ui/Button';
import HomeIcon from '../../../ui/icons/adminUI/HomeIcon';
import EditIcon from '../../../ui/icons/adminUI/EditIcon';
import ImageIcon from '../../../ui/icons/adminUI/ImageIcon';
import ibc_logo from '../../../../assets/navigation/logo.svg';

interface AdminUINavbarProps {
  view: number;
  setView: (view: number) => void;
}


function AdminUINavbar({ view, setView }: AdminUINavbarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // when sign in/out logic is implemented,
    // remove any cookies/local storage items here as well
    navigate('/edit/signin');
  }

	return (
		<div className="editor-navbar">

        {/* logo */}
        <div className="editor-navbar-header">
            <img src={ibc_logo} alt="ibc logo"/>
            <div className="editor-navbar-title">
                <h2>Itty Bitty<br />Critters</h2>
                <h3 className="editor-navbar-admin-label">Admin Panel</h3>
            </div>
        </div>

        <hr className="editor-navbar-divider" />

        {/* navbar */}
        <div className="editor-navbar-content">
          <div className="navbar-button-container">
            <Button handleClick={() => setView(0)} variance="tertiary" active={view === 0} icon={<HomeIcon />}>
              Dashboard
            </Button>
            <Button handleClick={() => setView(1)} variance="tertiary" active={view === 1} icon={<EditIcon />}>
              Edit Pages
            </Button>
            <Button handleClick={() => setView(2)} variance="tertiary" active={view === 2} icon={<ImageIcon />}>
              Images
            </Button>
          </div>
          <div className="signout-button-container">
            <Button handleClick={handleSignOut} variance="secondary">
              Sign Out
            </Button>
          </div>
        </div>

      </div>
	);
}

export default AdminUINavbar;
