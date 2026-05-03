import './AdminUILayout.css';
import Dashboard from "../views/Dashboard";
import EditPages from '../views/EditPages';

interface AdminUILayoutProps {
    view: number;
    setView: React.Dispatch<React.SetStateAction<number>>;
    editPageNumber: number;
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

function AdminUILayout({ view, setView, editPageNumber, setEditPageNumber }: AdminUILayoutProps) {
    return (
        <div className="admin-ui-layout">
            {view === 0 && <Dashboard setView={setView} setEditPageNumber={setEditPageNumber} />}
            {view === 1 && <EditPages editPageNumber={editPageNumber} setEditPageNumber={setEditPageNumber} />}
        </div>
    );
}

export default AdminUILayout;