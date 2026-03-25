import './AdminUILayout.css';
import Dashboard from "../views/Dashboard";

interface AdminUILayoutProps {
    view: number;
}

function AdminUILayout({ view }: AdminUILayoutProps) {
    return (
        <div className="admin-ui-layout">
            {view === 0 && <Dashboard />}
        </div>
    );
}

export default AdminUILayout;