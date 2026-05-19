import './AdminUINavbar.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../ui/Button';
import HomeIcon from '../../../ui/icons/adminUI/HomeIcon';
import EditIcon from '../../../ui/icons/adminUI/EditIcon';
import ibc_logo from '../../../../assets/navigation/logo.svg';

interface AdminUINavbarProps {
  view: number;
  setView: (view: number) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}


function AdminUINavbar({ view, setView, collapsed = false }: AdminUINavbarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/edit/signin');
  };

	return (
		<div className={`editor-navbar${collapsed ? ' editor-navbar--collapsed' : ''}`}>

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
