interface EditIconProps {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export function EditIcon({ width = 35, height = 35, color = '#000000', strokeWidth = 4 }: EditIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.0417 5.83334H5.83341C5.05987 5.83334 4.318 6.14063 3.77102 6.68761C3.22404 7.23459 2.91675 7.97646 2.91675 8.75V29.1667C2.91675 29.9402 3.22404 30.6821 3.77102 31.2291C4.318 31.776 5.05987 32.0833 5.83341 32.0833H26.2501C27.0236 32.0833 27.7655 31.776 28.3125 31.2291C28.8595 30.6821 29.1667 29.9402 29.1667 29.1667V18.9583M26.9792 3.64584C27.5594 3.06568 28.3463 2.73975 29.1667 2.73975C29.9872 2.73975 30.7741 3.06568 31.3542 3.64584C31.9344 4.226 32.2603 5.01287 32.2603 5.83334C32.2603 6.65381 31.9344 7.44068 31.3542 8.02084L17.5001 21.875L11.6667 23.3333L13.1251 17.5L26.9792 3.64584Z" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default EditIcon;

