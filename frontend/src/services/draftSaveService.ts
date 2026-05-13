import auth from '../features/firebase/firebaseApp';

export type PageSnapshot = Array<{ id: string; text: string; stylingUpdates: string }>;

type DraftDoc = { id: string; site_id: string; version: number; is_active: boolean };
type PageDoc = { id: string; draft_id: string | null; page_number: number; page_name: string; content: PageSnapshot | null };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';
const SITE_ID = import.meta.env.VITE_SITE_ID ?? '1';

// page_number sentinel for shared nav/footer content
const SHARED_PAGE_NUMBER = -1;

const PAGE_NAMES = ['Home', 'About', 'Education', 'Volunteer', 'Contact', 'Header'];

async function getToken(): Promise<string> {
  // authStateReady() resolves once Firebase has finished restoring any persisted session
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function getOrCreateActiveDraft(token: string): Promise<DraftDoc | null> {
  const listRes = await fetch(`${API_BASE_URL}/sites/${SITE_ID}/drafts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listRes.ok) {
    console.error('[Save] GET drafts failed:', listRes.status, await listRes.text());
    return null;
  }
  const drafts: DraftDoc[] = await listRes.json();
  const existing = drafts.find(d => d.is_active);
  if (existing) {
    console.log('[Save] Found active draft:', existing.id);
    return existing;
  }

  console.log('[Save] No active draft, creating one...');
  const createRes = await fetch(`${API_BASE_URL}/sites/${SITE_ID}/drafts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ site_id: SITE_ID, version: 1, is_active: true }),
  });
  if (!createRes.ok) {
    console.error('[Save] POST draft failed:', createRes.status, await createRes.text());
    return null;
  }
  const created: DraftDoc = await createRes.json();
  console.log('[Save] Created draft:', created.id);
  return created;
}

async function getActiveDraft(token: string): Promise<DraftDoc | null> {
  const listRes = await fetch(`${API_BASE_URL}/sites/${SITE_ID}/drafts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listRes.ok) return null;
  const drafts: DraftDoc[] = await listRes.json();
  return drafts.find(d => d.is_active) ?? null;
}

async function getDraftPages(draftId: string, token: string): Promise<PageDoc[]> {
  const res = await fetch(`${API_BASE_URL}/drafts/${draftId}/pages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

async function upsertPageContent(
  draftId: string,
  pageNumber: number,
  pageName: string,
  content: PageSnapshot,
  existingPages: PageDoc[],
  token: string,
): Promise<void> {
  const existing = existingPages.find(p => p.page_number === pageNumber);
  if (existing) {
    await fetch(`${API_BASE_URL}/drafts/${draftId}/pages/${existing.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  } else {
    await fetch(`${API_BASE_URL}/drafts/${draftId}/pages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft_id: draftId, published_version_id: null, page_name: pageName, page_number: pageNumber, content }),
    });
  }
}

export async function saveAllPagesToDatabase(): Promise<void> {
  const token = await getToken();
  const draft = await getOrCreateActiveDraft(token);
  if (!draft) return;

  const pages = await getDraftPages(draft.id, token);
  const saves: Promise<void>[] = [];

  for (let pageNum = 0; pageNum <= 5; pageNum++) {
    const raw = localStorage.getItem(`bp-ibc:autosave:page-${pageNum}`);
    if (!raw) continue;
    try {
      const content: PageSnapshot = JSON.parse(raw);
      saves.push(upsertPageContent(draft.id, pageNum, PAGE_NAMES[pageNum] ?? `Page ${pageNum}`, content, pages, token));
    } catch { /* ignore malformed JSON */ }
  }

  const sharedRaw = localStorage.getItem('bp-ibc:autosave:shared');
  if (sharedRaw) {
    try {
      const content: PageSnapshot = JSON.parse(sharedRaw);
      saves.push(upsertPageContent(draft.id, SHARED_PAGE_NUMBER, 'Shared', content, pages, token));
    } catch { /* ignore malformed JSON */ }
  }

  await Promise.all(saves);
  console.log(`[Save] Done — saved ${saves.length} page(s) to DB`);
}

export async function loadPageFromDatabase(pageNumber: number): Promise<PageSnapshot | null> {
  try {
    const token = await getToken();
    const draft = await getActiveDraft(token);
    if (!draft) return null;
    const pages = await getDraftPages(draft.id, token);
    return pages.find(p => p.page_number === pageNumber)?.content ?? null;
  } catch {
    return null;
  }
}

export async function loadSharedFromDatabase(): Promise<PageSnapshot | null> {
  return loadPageFromDatabase(SHARED_PAGE_NUMBER);
}
