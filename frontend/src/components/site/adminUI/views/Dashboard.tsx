import './Dashboard.css';
import DashboardCard from '../DashboardCard';
import EditIcon from '../../../ui/icons/adminUI/EditIcon';
import ImageIcon from '../../../ui/icons/adminUI/ImageIcon';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">What would you like to do today?</h1>
            <div className="dashboard-cards-container">
                <DashboardCard
                    title="Home Page"
                    content="Update headlines, buttons, and images."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="About Page"
                    content="Update mission statement, and organization info."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Education Page"
                    content="Update wildlife guidance, and act guidelines."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Volunteer Page"
                    content="Update volunteer role descriptions."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Contact Page"
                    content="Update contact information."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<EditIcon width={62} height={62} strokeWidth={2} />}
                />
                <DashboardCard
                    title="Images"
                    content="Rearrange or upload new images for your site."
                    handleClick={() => console.log("Editing Home Page")}
                    icon={<ImageIcon width={62} height={62} strokeWidth={2} />}
                />
            </div>
        </div>
    );
}
export default Dashboard;