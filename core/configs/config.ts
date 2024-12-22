import 'dotenv/config';

export const config = {
  debugPort: Number(process.env.DEBUG_PORT),
  device: process.env.DEVICE,
  projectKey: process.env.PROJECT_KEY,
  baseURL: 'https://www.wikipedia.org',
  extraHeaders: process.env.EXTRA_HEADERS,
  performance: process.env.PERFORMANCE,
  browser: process.env.BROWSER,
  apiBaseURL: 'https://beta.pokeapi.co',
  mockProviderURL: 'http://127.0.0.1:8081',
  screenshotTestingThreshold: 0.001
};
