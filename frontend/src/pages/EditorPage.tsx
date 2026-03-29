import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Page.css';
import '../App.css';
import LoadFromLocalAutoSave from '../components/save/LoadFromLocalAutoSave';
import { PageDropdown } from '../components/retrieve/RetrievePages';
import { getPageOption } from '../components/retrieve/pageOptions';
import useLocalAutoSave from '../components/save/useLocalAutoSave';
import SaveButton from '../components/save/SaveButton';
import { applyEditableTags, disableEditorLinks } from '../utils/applyEditableTags';
import { publishActiveDraft, type PageType } from '../services/publishService';
import { syncTemplateWithPublishedPages } from '../utils/syncPublishedPages';
import { useDispatch } from 'react-redux';
import { SetPublished, SetUnpublished } from '../features/siteStatus/siteStatus.slices';

function EditorPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pageOption = getPageOption(id);
  const storageKey = `bp-ibc:autosave:${pageOption.id}`;
  const sharedStorageKey = 'bp-ibc:autosave:shared';
  const [editableReady, setEditableReady] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishedPages, setPublishedPages] = useState<PageType[]>([]);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const siteId = import.meta.env.VITE_SITE_ID ?? '1';

  useLocalAutoSave(storageKey, sharedStorageKey, frameRef);
  const PageComponent = pageOption.Component;

  const handleClearDraft = () => {
    localStorage.removeItem(storageKey);
    window.location.reload(); // Reload to show original content
  };

  const handleClearSharedDraft = () => {
    localStorage.removeItem(sharedStorageKey);
    window.location.reload(); // Reload to show original content
  };

  const handlePublish = async () => {
    setPublishError(null);
    setPublishSuccess(null);
    setIsPublishing(true);

    try {
      const { message, pages } = await publishActiveDraft(siteId);
      setPublishedPages(pages);

      if (import.meta.env.DEV) {
        console.log('[Publish QA] fetched pages payload', {
          count: pages.length,
          firstPage: pages[0] ?? null,
          firstPageKeys: pages[0] ? Object.keys(pages[0]) : [],
        });
      }

      const frame = frameRef.current;
      const syncResult =
        frame && pages.length
          ? syncTemplateWithPublishedPages(frame, pages)
          : { differences: [], appliedCount: 0 };

      setPublishSuccess(
        `${message} (${syncResult.appliedCount} template updates applied)`
      );
      dispatch(SetPublished());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish draft.';
      setPublishError(message);
      setPublishedPages([]);
      dispatch(SetUnpublished());
    } finally {
      setIsPublishing(false);
    }
  };

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

  return (
    <div className="editor-shell">
      <aside className="editor-sidebar">
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
      </aside>
      <main className="editor-main">
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
          {publishSuccess && (
            <p className="editor-status editor-status--success">
              {publishSuccess}
            </p>
          )}
          {publishSuccess && (
            <p className="editor-status editor-status--success">
              Published pages fetched: {publishedPages.length}
            </p>
          )}
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
      </main>
    </div>
  );
}

export default EditorPage;
