import auth from '../features/firebase/firebaseApp';

type DraftModel = {
  id: string;
  site_id: string;
  version: number;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

type PublishResponse = {
  message?: string;
};

type PublishedResponse = {
  draft_id: string;
};

export type PageType = {
  id: string;
  draft_id: string | null;
  published_version_id: string | null;
  page_name: string;
  page_number: number;
  created_at: string | Date;
  [key: string]: unknown;
};

type PublishResult = {
  message: string;
  pages: PageType[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

async function getAuthToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must sign in before publishing.');
  }

  return currentUser.getIdToken();
}

function getMessageFromResponse(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as { message?: string }).message === 'string'
  ) {
    return (payload as { message: string }).message;
  }

  return fallback;
}

async function fetchActiveDraft(siteId: string, token: string): Promise<DraftModel> {
  const response = await fetch(`${API_BASE_URL}/sites/${siteId}/drafts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getMessageFromResponse(payload, 'Failed to fetch drafts.'));
  }

  if (!Array.isArray(payload)) {
    throw new Error('Invalid drafts response from server.');
  }

  const activeDraft = payload.find(
    (draft): draft is DraftModel =>
      draft &&
      typeof draft === 'object' &&
      typeof draft.id === 'string' &&
      typeof draft.site_id === 'string' &&
      typeof draft.version === 'number' &&
      typeof draft.is_active === 'boolean' &&
      draft.is_active
  );

  if (!activeDraft) {
    throw new Error('No active draft available to publish.');
  }

  return activeDraft;
}

async function fetchCurrentPublished(siteId: string, token: string): Promise<PublishedResponse> {
  const response = await fetch(`${API_BASE_URL}/sites/${siteId}/published`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getMessageFromResponse(payload, 'Failed to fetch published content.'));
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof (payload as { draft_id?: unknown }).draft_id !== 'string'
  ) {
    throw new Error('Invalid published response from server.');
  }

  return payload as PublishedResponse;
}

async function fetchPublishedPages(draftId: string, token: string): Promise<PageType[]> {
  const response = await fetch(`${API_BASE_URL}/drafts/${draftId}/pages`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getMessageFromResponse(payload, 'Failed to fetch published pages.'));
  }

  if (!Array.isArray(payload)) {
    throw new Error('Invalid pages response from server.');
  }

  return payload as PageType[];
}

export async function publishActiveDraft(siteId: string): Promise<PublishResult> {
  const token = await getAuthToken();
  const activeDraft = await fetchActiveDraft(siteId, token);

  const response = await fetch(`${API_BASE_URL}/sites/${siteId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activeDraft),
  });

  const payload = (await response.json().catch(() => null)) as PublishResponse | null;

  if (!response.ok) {
    throw new Error(getMessageFromResponse(payload, 'Failed to publish draft.'));
  }

  const published = await fetchCurrentPublished(siteId, token);
  const pages = await fetchPublishedPages(published.draft_id, token);

  return {
    message: getMessageFromResponse(payload, 'Draft published successfully.'),
    pages,
  };
}
