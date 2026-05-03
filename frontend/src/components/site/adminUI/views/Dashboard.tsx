import './Dashboard.css';
import DashboardCard from '../DashboardCard';
import EditIcon from '../../../ui/icons/adminUI/EditIcon';
import ImageIcon from '../../../ui/icons/adminUI/ImageIcon';

interface DashboardProps {
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setView: React.Dispatch<React.SetStateAction<number>>;
}


// component to display the dashboard for the admin UI,
// which includes cards for each page of the site and an image management card
function Dashboard({ setEditPageNumber, setView }: DashboardProps) {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">What would you like to do today?</h1>
            <div className="dashboard-cards-container">
                <DashboardCard
                    title="Home Page"
                    content="Update headlines, buttons, and images."
                    handleClick={() => {
                        setEditPageNumber(0);
                        setView(1);
                    }}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="About Page"
                    content="Update mission statement, and organization info."
                    handleClick={() => {
                        setEditPageNumber(1);
                        setView(1);
                    }}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Education Page"
                    content="Update wildlife guidance, and act guidelines."
                    handleClick={() => {
                        setEditPageNumber(2);
                        setView(1);
                    }}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Volunteer Page"
                    content="Update volunteer role descriptions."
                    handleClick={() => {
                        setEditPageNumber(3);
                        setView(1);
                    }}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Contact Page"
                    content="Update contact information."
                    handleClick={() => {
                        setEditPageNumber(4);
                        setView(1);
                    }}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Images"
                    content="Rearrange or upload new images for your site."
                    handleClick={() => {
                        setView(2);
                    }}
                    icon={<ImageIcon width={62} height={62} strokeWidth={2} />}
                />
            </div>
        </div>
    );
}
export default Dashboard;