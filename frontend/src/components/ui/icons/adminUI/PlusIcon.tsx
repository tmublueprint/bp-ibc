interface PlusIconProps {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export function PlusIcon({ width = 32, height = 32, color = 'black', strokeWidth = 3 }: PlusIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6.66699V33.3337M6.66663 20H33.3333" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default PlusIcon;