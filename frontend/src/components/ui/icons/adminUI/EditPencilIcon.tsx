interface EditPencilIconProps {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export function EditPencilIcon({ width = 40, height = 40, color = 'white', strokeWidth = 3 }: EditPencilIconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 33.3333H35M27.5 5.83332C28.163 5.17028 29.0623 4.79779 30 4.79779C30.4643 4.79779 30.924 4.88924 31.353 5.06692C31.7819 5.24459 32.1717 5.50502 32.5 5.83332C32.8283 6.16163 33.0887 6.55138 33.2664 6.98033C33.4441 7.40928 33.5355 7.86903 33.5355 8.33332C33.5355 8.79762 33.4441 9.25736 33.2664 9.68631C33.0887 10.1153 32.8283 10.505 32.5 10.8333L11.6667 31.6667L5 33.3333L6.66667 26.6667L27.5 5.83332Z" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default EditPencilIcon;