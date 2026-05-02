import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Page.css';
import '../App.css';
// import LoadFromLocalAutoSave from '../components/save/LoadFromLocalAutoSave';
// import { PageDropdown } from '../components/retrieve/RetrievePages';
import { getPageOption } from '../components/retrieve/pageOptions';
// import useLocalAutoSave from '../components/save/useLocalAutoSave';
// import SaveButton from '../components/save/SaveButton';
import { applyEditableTags, disableEditorLinks } from '../utils/applyEditableTags';
// import { removeAllHighlightingForEditedElements } from '../utils/record';
// import { publishActiveDraft } from '../services/publishService';
// import { useDispatch } from 'react-redux';
// import { SetPublished, SetUnpublished } from '../features/siteStatus/siteStatus.slices';

import AdminUINavbar from '../components/site/adminUI/layout/AdminUINavbar';
import AdminUIHeader from '../components/site/adminUI/layout/AdminUIHeader';
import AdminUILayout from '../components/site/adminUI/layout/AdminUILayout';
import { ComputerIcon } from '../components/ui/icons/adminUI/ComputerIcon';

function EditorPage() {
  // const dispatch = useDispatch();
  const { id } = useParams();
  const pageOption = getPageOption(id);
  // const storageKey = `bp-ibc:autosave:${pageOption.id}`;
  // const sharedStorageKey = 'bp-ibc:autosave:shared';
  const [editableReady, setEditableReady] = useState(false);
  // const [isPublishing, setIsPublishing] = useState(false);
  // const [publishError, setPublishError] = useState<string | null>(null);
  // const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  // const siteId = import.meta.env.VITE_SITE_ID ?? '1';

  const [view, setView] = useState(0); // 0 = dashboard | 1 = edit | 2 = images
  const [editPageNumber, setEditPageNumber] = useState(0); // 0 = home | 1 = about | 2 = education | 3 = volunteer | 4 = contact | 5 = header

  const [isWindowTooSmall, setIsWindowTooSmall] = useState(window.innerWidth < 1400);

  useEffect(() => {
    const handleResize = () => {
      setIsWindowTooSmall(window.innerWidth < 1400);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useLocalAutoSave(storageKey, sharedStorageKey, frameRef);
  // const PageComponent = pageOption.Component;

  // const handleClearDraft = () => {
  //   localStorage.removeItem(storageKey);
  //   window.location.reload(); // Reload to show original content
  // };

  // const handleClearSharedDraft = () => {
  //   localStorage.removeItem(sharedStorageKey);
  //   window.location.reload(); // Reload to show original content
  // };

  // const handlePublish = async () => {
  //   setPublishError(null);
  //   setPublishSuccess(null);
  //   setIsPublishing(true);

  //   try {
  //     const message = await publishActiveDraft(siteId);
  //     setPublishSuccess(message);
  //     dispatch(SetPublished());
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'Failed to publish draft.';
  //     setPublishError(message);
  //     dispatch(SetUnpublished());
  //   } finally {
  //     setIsPublishing(false);
  //   }

  //   removeAllHighlightingForEditedElements;
  // };

  useEffect(() => {
    setEditableReady(false);
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    let attempts = 0;
    let timeoutId: number | undefined;
    let observer: MutationObserver | undefined;

    const runTagging = () => {
      const editableCount = applyEditableTags(frame);
      disableEditorLinks(frame);

      if (editableCount > 0) {
        setEditableReady(true);
        observer?.disconnect();
        return;
      }

      if (attempts < 5) {
        attempts += 1;
        timeoutId = window.setTimeout(runTagging, 120);
      }
    };

    requestAnimationFrame(runTagging);

    observer = new MutationObserver(() => {
      if (!editableReady) {
        runTagging();
      }
    });

    observer.observe(frame, { childList: true, subtree: true });

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      observer?.disconnect();
    };
  }, [pageOption.id]);

  if (isWindowTooSmall) {
    return (
      <div className="editor-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center', color: '#1E2E5E' }}>
        <ComputerIcon />
        <h2>The screen is too small to view the editor content.<br/><br/>Please view on a window wider than 1400px.</h2>
      </div>
    );
  }

  return (
    <div className="editor-page">
      {/* Admin Panel navbar */}
      <AdminUINavbar 
        view={view}
        setView={setView}
      />

      <div className="editor-content">
        {/* header */}
        <AdminUIHeader
          view={view}
        />

        {/* layout */}
        <AdminUILayout
          view={view} 
          setView={setView}
          editPageNumber={editPageNumber}
          setEditPageNumber={setEditPageNumber}
        />
      </div>

      {/* <aside className="editor-sidebar">
        <div className="editor-sidebar__content">
          <p className="eyebrow">Site editor</p>
          <h1 className="editor-title">{pageOption.label}</h1>
          <PageDropdown />
          <div className="editor-panel">
            <h3>Editing tools</h3>
            <p className="muted">
              Select content on the canvas to edit text, styles, and sections.
            </p>
          </div>
        </div>
      </aside> */}
      {/* <main className="editor-main">
        <div className="editor-topbar">
          <div>
            <p className="eyebrow">Editing template</p>
            <h2 className="editor-heading">{pageOption.label} Page</h2>
          </div>
          <div className="editor-actions">
            <button
              type="button"
              className="editor-button editor-button--ghost"
              onClick={handleClearDraft}
              title="Clear this page's draft only"
            >
              Clear page draft
            </button>
            <button
              type="button"
              className="editor-button editor-button--ghost"
              onClick={handleClearSharedDraft}
              title="Clear navbar and footer drafts (affects all pages)"
            >
              Clear shared draft
            </button>
            <SaveButton />
            <button
              type="button"
              className="editor-button editor-button--ghost"
              title="Publish changes to live site"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
          {publishError && <p className="editor-status editor-status--error">{publishError}</p>}
          {publishSuccess && <p className="editor-status editor-status--success">{publishSuccess}</p>}
        </div>
        <div className="editor-canvas">
          <div className="editor-canvas__frame" ref={frameRef}>
            <PageComponent />
            <LoadFromLocalAutoSave
              storageKey={storageKey}
              sharedStorageKey={sharedStorageKey}
              rootRef={frameRef}
              ready={editableReady}
            />
          </div>
        </div>
      </main> */}
    </div>
  );
}

export default EditorPage;
