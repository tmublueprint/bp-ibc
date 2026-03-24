interface ImageIconProps {
    width?: number;
    height?: number;
    color?: string;
}

export function ImageIcon({ width = 35, height = 35, color = '#000000' }: ImageIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.29167 30.625H27.7083C29.3192 30.625 30.625 29.3192 30.625 27.7083V7.29167C30.625 5.68084 29.3192 4.375 27.7083 4.375H7.29167C5.68084 4.375 4.375 5.68084 4.375 7.29167V27.7083C4.375 29.3192 5.68084 30.625 7.29167 30.625ZM7.29167 30.625L23.3333 14.5833L30.625 21.875M14.5833 12.3958C14.5833 13.604 13.604 14.5833 12.3958 14.5833C11.1877 14.5833 10.2083 13.604 10.2083 12.3958C10.2083 11.1877 11.1877 10.2083 12.3958 10.2083C13.604 10.2083 14.5833 11.1877 14.5833 12.3958Z" stroke={color} stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default ImageIcon;
