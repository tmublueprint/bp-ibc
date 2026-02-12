import auth from '../features/firebase/firebaseApp';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function triggerDeploy(): Promise<{ success: boolean; message: string }> {
  const token = await auth.currentUser?.getIdToken();

  const response = await fetch(`${API_BASE}/api/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Deploy request failed' }));
    throw new Error(body.error ?? `Deploy failed with status ${response.status}`);
  }

  return response.json();
}
