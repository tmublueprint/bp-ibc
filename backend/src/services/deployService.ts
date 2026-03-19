export async function triggerDeploy(): Promise<{ success: boolean; message: string }> {
  const webhookUrl = process.env.DEPLOY_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      'DEPLOY_WEBHOOK_URL is not configured. Set it in the environment variables to enable re-deploy'
    );
  }

  const response = await fetch(webhookUrl, { method: 'POST' });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Deploy webhook returned ${response.status}: ${body}`);
  }

  return { success: true, message: 'Deploy triggered successfully' };
}
