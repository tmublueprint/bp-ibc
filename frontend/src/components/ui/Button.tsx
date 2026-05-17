import './Button.css'

interface ButtonProps {
    handleClick: () => void; // function to be called when the button is clicked
    children: React.ReactNode; // the button text
    variance?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; 
    disabled?: boolean; // if the button is disabled, it will have a different style and the handleClick function will not be called when the button is clicked
    icon?: React.ReactNode; // include an icon to the left of the button text
    borderRadius?: string; // modify the border radius if it is unique from the variances
    active?: boolean; // if the button is active, it will have a different style to indicate that it is active. Refer to navbar buttons in the admin UI as an example
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
            <span className="button-text">{children}</span>
        </button>
    );
}