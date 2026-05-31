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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

async function getAuthToken() {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must sign in before publishing.');
  }

  return currentUser.getIdToken(/* forceRefresh */ true);
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

export async function publishActiveDraft(siteId: string): Promise<string> {
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

  return getMessageFromResponse(payload, 'Draft published successfully.');
}
