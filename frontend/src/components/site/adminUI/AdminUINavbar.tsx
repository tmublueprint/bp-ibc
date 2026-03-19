import './AdminUINavbar.css';
import logo from '../../../assets/navigation/logo.svg';
import homeIcon from '../../../assets/adminUI/homeIcon.svg';
import editIcon from '../../../assets/adminUI/editIcon.svg';
import imageIcon from '../../../assets/adminUI/imageIcon.svg';

function AdminUINavbar() {
	return (
		<aside className="admin-ui-navbar" style={{ fontFamily: 'DM Sans, sans-serif' }}>
			<div className="admin-ui-navbar-brand">
				<div className="admin-ui-navbar-brand-icon">
					<img src={logo} alt="Itty Bitty Critters logo" />
				</div>

				<div className="admin-ui-navbar-brand-copy">
					<p>Itty Bitty</p>
					<p>Critters</p>
					<p className='admin-panel-text'>Admin Panel</p>
				</div>
			</div>

			<div className="admin-ui-navbar-divider" />

			<nav className="admin-ui-navbar-nav" aria-label="Admin navigation">
				<ul>
					<li>
						<div className="admin-ui-nav-item">
							<span className="admin-ui-nav-icon" aria-hidden="true">
								<img src={homeIcon} alt="" />
							</span>
							<span className="admin-ui-nav-label">Dashboard</span>
						</div>
					</li>

					<li>
						<div className="admin-ui-nav-item admin-ui-nav-item-active">
							<span className="admin-ui-nav-icon" aria-hidden="true">
								<img src={editIcon} alt="" />
							</span>
							<span className="admin-ui-nav-label">Edit Pages</span>
						</div>
					</li>

					<li>
						<div className="admin-ui-nav-item">
							<span className="admin-ui-nav-icon" aria-hidden="true">
								<img src={imageIcon} alt="" />
							</span>
							<span className="admin-ui-nav-label">Images</span>
						</div>
					</li>
				</ul>
			</nav>

			<div className="admin-ui-navbar-footer">
				<button type="button" className="admin-ui-sign-out-button">
					Sign Out
				</button>
			</div>
		</aside>
	);
}

export default AdminUINavbar;
