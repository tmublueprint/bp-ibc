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
    const isHeaderView = editPageNumber === 5;

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
            <EditPageNavbar editPageNumber={editPageNumber} setEditPageNumber={setEditPageNumber} />
            <TextEditorToolbar />
            <div className={canvasClass} ref={frameRef}>
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

export default EditPages;
