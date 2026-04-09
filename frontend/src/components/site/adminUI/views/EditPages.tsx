import './EditPages.css';
import EditPageNavbar from '../EditPageNavbar';

interface EditPagesProps {
    editPageNumber: number;
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

// component to display the edit pages for the admin UI
function EditPages({ editPageNumber, setEditPageNumber }: EditPagesProps) {
    return (
        <div className="edit-pages-container">
            <EditPageNavbar editPageNumber={editPageNumber} setEditPageNumber={setEditPageNumber} />
        </div>
    );
}

export default EditPages;