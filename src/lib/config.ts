// FindaFlight — Environment Configuration

interface Config {
  serpApiKey: string;
  useMockData: boolean;
}

/**
 * Server-side config — use only in API routes.
 * Falls back to mock data if SERPAPI_KEY is not set.
 */
export function getServerConfig(): Config {
  const serpApiKey = process.env.SERPAPI_KEY || '';
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !serpApiKey;

  return {
    serpApiKey,
    useMockData,
  };
}
