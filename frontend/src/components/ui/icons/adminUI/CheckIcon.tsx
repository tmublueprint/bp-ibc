interface CheckIconProps {
    width?: number;
    height?: number;
    color?: string;
}

export function CheckIcon({ width = 32, height = 32, color = '#1E2E5E' }: CheckIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.6666 8L11.9999 22.6667L5.33325 16" stroke={color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default CheckIcon;