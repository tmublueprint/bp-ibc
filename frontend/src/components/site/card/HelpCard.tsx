import './HelpCard.css';

interface HelpCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
}

export default function HelpCard({ icon, title, description }: HelpCardProps) {
  return (
    <div className="help-card">
      <div className="help-card-icon">
        {typeof icon === "string" ? (
          <img src={icon} alt="" />
        ) : (
          icon
        )}
      </div>

      <h3 className="help-card-title">{title}</h3>
      <p className="help-card-description">{description}</p>
    </div>
  );
}
