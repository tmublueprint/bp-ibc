import './AdminUIHeader.css';
import { Button } from '../../../ui/Button';
import EyeIcon from '../../../ui/icons/adminUI/EyeIcon';
import CheckIcon from '../../../ui/icons/adminUI/CheckIcon';

interface AdminUIHeaderProps {
    view: number;
}

function AdminUIHeader({ view }: AdminUIHeaderProps) {
    return (
        <div className="admin-header-container">
            <h1>Hi, Kelly!&nbsp;
                <span>
                    {view === 1 ? "You're editing pages now." 
                    : view === 2 ? "You're managing images now." 
                    : ""}
                </span>
            </h1>
            {view === 1 &&
                <div className="buttons-container">
                    <Button handleClick={() => console.log("Previewing site")} variance="secondary" icon={<EyeIcon />}>
                        Preview Site
                    </Button>
                    <Button handleClick={() => console.log("Applying changes")} variance="secondary" icon={<CheckIcon />}>
                        Apply Changes
                    </Button>
                </div>
            }
        </div>
    );
}

export default AdminUIHeader;