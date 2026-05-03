interface EyeIconProps {
    width?: number;
    height?: number;
    color?: string;
}

export function EyeIcon({ width = 32, height = 32, color = '#1E2E5E' }: EyeIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.33325 16C1.33325 16 6.66659 5.33331 15.9999 5.33331C25.3333 5.33331 30.6666 16 30.6666 16C30.6666 16 25.3333 26.6666 15.9999 26.6666C6.66659 26.6666 1.33325 16 1.33325 16Z" stroke={color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.9999 20C18.2091 20 19.9999 18.2091 19.9999 16C19.9999 13.7908 18.2091 12 15.9999 12C13.7908 12 11.9999 13.7908 11.9999 16C11.9999 18.2091 13.7908 20 15.9999 20Z" stroke={color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default EyeIcon;
