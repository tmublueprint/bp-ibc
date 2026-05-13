import { useState, useRef } from 'react';
import './Images.css';
import { Button } from '../../../ui/Button';
import PlusIcon from '../../../ui/icons/adminUI/PlusIcon';

const PAGE_TABS = [
    { label: 'Home Page',       pageNumber: 0 },
    { label: 'About Page',      pageNumber: 1 },
    { label: 'Education Page',  pageNumber: 2 },
    { label: 'Volunteer Page',  pageNumber: 3 },
    { label: 'Contact Page',    pageNumber: 4 },
];

interface ImageEntry {
    id: number;
    src: string;
    name: string;
}

interface ImagesProps {
    setView: React.Dispatch<React.SetStateAction<number>>;
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

function TrashIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 8H23" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M11 8V6H17V8" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 8L8.5 22H19.5L21 8" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="11" y1="12" x2="11" y2="18" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="12" x2="14" y2="18" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="12" x2="17" y2="18" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

let nextId = 1;

function Images({ setView, setEditPageNumber }: ImagesProps) {
    const [images, setImages] = useState<ImageEntry[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const newEntries: ImageEntry[] = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .map(f => ({ id: nextId++, src: URL.createObjectURL(f), name: f.name }));
        setImages(prev => [...prev, ...newEntries]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleDelete = (id: number) => setImages(prev => prev.filter(img => img.id !== id));

    const handlePageTab = (pageNumber: number) => {
        setEditPageNumber(pageNumber);
        setView(1);
    };

    return (
        <div className="images-container">
            {/* Tab bar */}
            <div className="images-tab-bar">
                <Button
                    handleClick={() => fileInputRef.current?.click()}
                    variance="quaternary"
                    borderRadius="27px"
                    active
                    icon={<PlusIcon color="white" />}
                >
                    Upload New Images
                </Button>
                {PAGE_TABS.map(tab => (
                    <Button
                        key={tab.label}
                        handleClick={() => handlePageTab(tab.pageNumber)}
                        variance="quaternary"
                        borderRadius="27px"
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Drop zone */}
            <div
                className={`images-dropzone${isDragging ? ' images-dropzone--active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <span className="images-dropzone-title">Drag and drop photos here.</span>
                <span className="images-dropzone-or">or</span>
                <button className="images-choose-btn" onClick={() => fileInputRef.current?.click()}>
                    Choose from your device
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)}
            />

            {/* Image grid */}
            <div className="images-grid">
                {images.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="image-card">
                            <div className="image-card-placeholder">
                                <span>*image library*</span>
                            </div>
                            <button className="image-card-delete" disabled>
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                    : images.map(img => (
                        <div key={img.id} className="image-card">
                            <div className="image-card-placeholder image-card-placeholder--filled">
                                <img src={img.src} alt={img.name} />
                            </div>
                            <button className="image-card-delete" onClick={() => handleDelete(img.id)}>
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Images;
