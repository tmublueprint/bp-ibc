import { useEffect, useRef, useState, useContext } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import './EditPages.css';
import EditPageNavbar from '../EditPageNavbar';
import TextEditorToolbar from './TextEditorToolbar';
import { applyEditableTags, disableEditorLinks } from '../../../../utils/applyEditableTags';
import useLocalAutoSave from '../../../../components/save/useLocalAutoSave';
import LoadFromLocalAutoSave from '../../../../components/save/LoadFromLocalAutoSave';
import HomePage from '../../../../pages/HomePage';
import AboutPage from '../../../../pages/AboutPage';
import EducationPage from '../../../../pages/EducationPage';
import VolunteerPage from '../../../../pages/VolunteerPage';
import Navbar from '../../../../components/site/navigation/Navbar';
import { loadPageFromDatabase, loadSharedFromDatabase } from '../../../../services/draftSaveService';

interface EditPagesProps {
    editPageNumber: number;
    setEditPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const PAGE_COMPONENTS = [HomePage, AboutPage, EducationPage, VolunteerPage];

function ContactPlaceholder() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: 'DM Sans, sans-serif', color: '#9EA8C4', fontSize: '28px' }}>
            Contact Page — coming soon
        </div>
    );
}

function EditPages({ editPageNumber, setEditPageNumber }: EditPagesProps) {
    const navContext = useContext(UNSAFE_NavigationContext);
    const frozenNavContext = {
        ...navContext,
        navigator: {
            ...navContext.navigator,
            push: () => {},
            replace: () => {},
            go: () => {},
        },
    };
    const frameRef = useRef<HTMLDivElement | null>(null);
    const [editableReady, setEditableReady] = useState(false);
    const [dbSeedReady, setDbSeedReady] = useState(false);
    const [navVisible, setNavVisible] = useState(true);
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const lastScrollY = useRef(0);
    const isHeaderView = editPageNumber === 5;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const y = e.currentTarget.scrollTop;
        if (y < 50) {
            setToolbarVisible(true);
        } else if (y < lastScrollY.current) {
            setToolbarVisible(true);
        } else {
            setToolbarVisible(false);
        }
        lastScrollY.current = y;
    };

    const storageKey = `bp-ibc:autosave:page-${editPageNumber}`;
    const sharedStorageKey = 'bp-ibc:autosave:shared';

    useLocalAutoSave(storageKey, sharedStorageKey, frameRef);

    // On page switch: seed localStorage from DB if no local draft exists
    useEffect(() => {
        setDbSeedReady(false);
        const hasLocal = !!localStorage.getItem(storageKey);
        const hasShared = !!localStorage.getItem(sharedStorageKey);

        if (hasLocal && hasShared) {
            setDbSeedReady(true);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                if (!hasLocal) {
                    const content = await loadPageFromDatabase(editPageNumber);
                    if (!cancelled && content) {
                        localStorage.setItem(storageKey, JSON.stringify(content));
                    }
                }
                if (!hasShared) {
                    const shared = await loadSharedFromDatabase();
                    if (!cancelled && shared) {
                        localStorage.setItem(sharedStorageKey, JSON.stringify(shared));
                    }
                }
            } catch (err) {
                console.warn('[Editor] Could not load from DB:', err);
            } finally {
                if (!cancelled) setDbSeedReady(true);
            }
        })();

        return () => { cancelled = true; };
    }, [editPageNumber, storageKey, sharedStorageKey]);

    useEffect(() => {
        setEditableReady(false);
        const frame = frameRef.current;
        if (!frame) return;

        let attempts = 0;
        let timeoutId: number | undefined;

        const runTagging = () => {
            const count = applyEditableTags(frame);
            disableEditorLinks(frame);
            if (count > 0) {
                setEditableReady(true);
                return;
            }
            if (attempts < 5) {
                attempts += 1;
                timeoutId = window.setTimeout(runTagging, 120);
            }
        };

        requestAnimationFrame(runTagging);
        return () => { if (timeoutId) window.clearTimeout(timeoutId); };
    }, [editPageNumber]);

    const PageComponent =
        editPageNumber === 4 ? ContactPlaceholder
        : editPageNumber === 5 ? Navbar
        : PAGE_COMPONENTS[editPageNumber] ?? HomePage;

    // hide the shared nav + footer when editing individual page content
    const canvasClass = `edit-pages-canvas${isHeaderView ? '' : ' edit-pages-canvas--hide-chrome'}`;

    return (
        <div className="edit-pages-container">

            {/* collapsible page nav */}
            <div className={`edit-pages-nav-wrap${navVisible ? '' : ' edit-pages-nav-wrap--hidden'}`}>
                <EditPageNavbar editPageNumber={editPageNumber} setEditPageNumber={setEditPageNumber} />
            </div>

            {/* always-visible strip: nav toggle + toolbar state hint */}
            <div className="edit-pages-controls">
                <button
                    className="edit-pages-nav-toggle"
                    onClick={() => setNavVisible(v => !v)}
                    title={navVisible ? 'Hide page selector' : 'Show page selector'}
                >
                    <NavToggleChevron up={navVisible} />
                    {navVisible ? 'Hide pages' : 'Show pages'}
                </button>
            </div>

            {/* auto-hide toolbar */}
            <div className={`edit-pages-toolbar-wrap${toolbarVisible ? '' : ' edit-pages-toolbar-wrap--hidden'}`}>
                <TextEditorToolbar />
            </div>

            <div className={canvasClass} ref={frameRef} onScroll={handleScroll}>
                <UNSAFE_NavigationContext.Provider value={frozenNavContext}>
                    <PageComponent />
                </UNSAFE_NavigationContext.Provider>
                <LoadFromLocalAutoSave
                    storageKey={storageKey}
                    sharedStorageKey={sharedStorageKey}
                    rootRef={frameRef}
                    ready={editableReady && dbSeedReady}
                />
            </div>
        </div>
    );
}

function NavToggleChevron({ up }: { up: boolean }) {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: up ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s ease' }}>
            <path d="M2.5 7.5L6 4L9.5 7.5" stroke="#1E2E5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default EditPages;
