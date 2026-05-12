import { useContext, useEffect } from 'react';
import { applyEditableTags } from '../../utils/applyEditableTags';
import { UIContext } from '../../context/UIContext';

type PageSnapshot = Array<{ id: string; text: string; stylingUpdates: string }>;
type PageDoc = { page_number: number; content: PageSnapshot | null };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-grwpwm6rea-uc.a.run.app/api';
const SITE_ID = import.meta.env.VITE_SITE_ID || '1';
const SHARED_PAGE_NUMBER = -1;

function applySnapshot(content: PageSnapshot) {
    content.forEach((item) => {
        const el = document.querySelector(`[data-editable-id="${item.id}"]`) as HTMLElement | null;
        if (!el) return;
        el.innerHTML = item.text;
        if (item.stylingUpdates) {
            el.setAttribute('data-styling-updates', item.stylingUpdates);
        }
    });
}

function LoadFromPublished({ pageNumber }: { pageNumber: number }) {
    const inEditor = useContext(UIContext) !== null;

    useEffect(() => {
        if (inEditor) return;
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/public/sites/${SITE_ID}/content`);
                if (!res.ok) return;
                const { pages }: { pages: PageDoc[] } = await res.json();

                // Use #root as the applyEditableTags root — it has the same relationship
                // to the page component as frameRef.current does in the editor, so the
                // generated data-editable-id paths are identical to what was saved.
                const root = document.getElementById('root') ?? document.body;
                applyEditableTags(root);

                const page = pages.find(p => p.page_number === pageNumber);
                const shared = pages.find(p => p.page_number === SHARED_PAGE_NUMBER);

                if (page?.content) applySnapshot(page.content);
                if (shared?.content) applySnapshot(shared.content);

                // Remove editor-only attributes so public pages have no hover/cursor styling
                root.querySelectorAll('[data-editable]').forEach(el => {
                    el.removeAttribute('data-editable');
                    el.removeAttribute('data-editable-leaf');
                });
            } catch {
                // Published content unavailable — show default page content
            }
        })();
    }, [pageNumber, inEditor]);

    return null;
}

export default LoadFromPublished;
