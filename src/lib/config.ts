// FindaFlight — Environment Configuration

interface Config {
  serpApiKey: string;
}

/**
 * Server-side config — use only in API routes.
 */
export function getServerConfig(): Config {
  const serpApiKey = process.env.SERPAPI_API_KEY || '';

  if (!serpApiKey) {
    console.warn('[FindaFlight] WARNING: SERPAPI_API_KEY is not set. Flight searches will fail.');
  }

  return { serpApiKey };
}
