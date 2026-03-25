import './DashboardCard.css';

interface DashboardCardProps {
    title: string;
    content: string;
    handleClick: () => void;
    icon: React.ReactNode;
}

function DashboardCard({ title, content, handleClick, icon }: DashboardCardProps) {
    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header" onClick={handleClick}>
                <div className="dashboard-card-icon">
                    {icon}
                </div>
                <h3 className="dashboard-card-title">Edit <span>{title}</span></h3>
            </div>
            <p className="dashboard-card-content">{content}</p>
        </div>
    )
}

export default DashboardCard;