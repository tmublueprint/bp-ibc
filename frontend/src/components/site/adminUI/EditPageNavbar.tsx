import './EditPageNavbar.css';
import { Button } from '../../ui/Button';
import EditPencilIcon from '../../ui/icons/adminUI/EditPencilIcon';
import PlusIcon from '../../ui/icons/adminUI/PlusIcon';

interface EditPageNavbarProps {
    editPageNumber: number;
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

function EditPageNavbar({ editPageNumber, setEditPageNumber }: EditPageNavbarProps) {
    return (
        <div className="button-container">
            <Button handleClick={() => setEditPageNumber(0)} variance="quaternary" borderRadius="27px" active={editPageNumber === 0} icon={ editPageNumber === 0 ? <EditPencilIcon /> : undefined }>
                Home Page
            </Button>
            <Button handleClick={() => setEditPageNumber(1)} variance="quaternary" borderRadius="27px" active={editPageNumber === 1} icon={ editPageNumber === 1 ? <EditPencilIcon /> : undefined }>
                About Page
            </Button>
            <Button handleClick={() => setEditPageNumber(2)} variance="quaternary" borderRadius="27px" active={editPageNumber === 2} icon={ editPageNumber === 2 ? <EditPencilIcon /> : undefined }>
                Education Page
            </Button>
            <Button handleClick={() => setEditPageNumber(3)} variance="quaternary" borderRadius="27px" active={editPageNumber === 3} icon={ editPageNumber === 3 ? <EditPencilIcon /> : undefined }>
                Volunteer Page
            </Button>
            <Button handleClick={() => setEditPageNumber(4)} variance="quaternary" borderRadius="27px" active={editPageNumber === 4} icon={ editPageNumber === 4 ? <EditPencilIcon /> : undefined }>
                Contact Page
            </Button>
            <Button handleClick={() => setEditPageNumber(5)} variance="quaternary" borderRadius="27px" active={editPageNumber === 5} icon={ editPageNumber === 5 ? <EditPencilIcon /> : undefined }>
                Header
            </Button>
            <Button handleClick={() => {}} variance="quaternary" borderRadius="27px" icon={<PlusIcon />}>
                Add Section
            </Button>
        </div>
    );
}

export default EditPageNavbar;