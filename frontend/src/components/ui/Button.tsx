import './Button.css'

interface ButtonProps {
    handleClick: () => void;
    children: React.ReactNode;
    variance?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    icon?: React.ReactNode;
    borderRadius?: string;
    active?: boolean;
}

// eventually have a loading state when api calls are made, which will
// change the state of button to disabled to prevent duplicate api calls

export function Button({ handleClick, children, variance = 'primary', disabled = false, icon, borderRadius, active }: ButtonProps) {
    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`button button-${variance} ${active ? `active-${variance}` : ''}`}
            style={{borderRadius: borderRadius}}
        >   
            {icon ?? null}
            {children}
        </button>
    );
}