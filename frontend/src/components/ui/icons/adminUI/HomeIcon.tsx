interface HomeIconProps {
    width?: number;
    height?: number;
    color?: string;
}

export function HomeIcon({ width = 35, height = 35, color = '#000000' }: HomeIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.125 32.0834V17.5H21.875V32.0834M4.375 13.125L17.5 2.91669L30.625 13.125V29.1667C30.625 29.9402 30.3177 30.6821 29.7707 31.2291C29.2237 31.7761 28.4819 32.0834 27.7083 32.0834H7.29167C6.51812 32.0834 5.77625 31.7761 5.22927 31.2291C4.68229 30.6821 4.375 29.9402 4.375 29.1667V13.125Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    );
}

export default HomeIcon;