import {
  createError,
  defineEventHandler,
  getRequestIP,
  getRequestHeaders,
  getRequestURL,
  proxyRequest,
} from 'h3';

function joinPath(basePath: string, extraPath: string): string {
  const normalizedBase = (basePath || '/').replace(/\/+$/, '');
  const normalizedExtra = (extraPath || '').replace(/^\/+/, '');
  const joined = `${normalizedBase}/${normalizedExtra}`.replace(/\/+$/, '');
  return joined === '' ? '/' : joined;
}

function parseConnectionTokens(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

export default defineEventHandler(async (event) => {
  const targetBase = process.env.NUXT_PROXY_TARGET || '';
  if (!targetBase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_PROXY_TARGET',
    });
  }

  const incomingUrl = getRequestURL(event);
  const upstream = new URL(targetBase);
  const forwardPath = incomingUrl.pathname.replace(/^\/api\/proxy\/?/, '');

  upstream.pathname = joinPath(upstream.pathname, forwardPath);
  upstream.search = incomingUrl.search;

  const url = upstream.toString();

  const incomingHeaders = getRequestHeaders(event);
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (typeof value === 'string') {
      headers[key.toLowerCase()] = value;
    }
  }

  // Strip hop-by-hop headers (RFC 7230) + any header names declared in `Connection`.
  const connectionTokens = parseConnectionTokens(headers.connection);
  const hopByHop = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    ...connectionTokens,
  ]);
  for (const name of hopByHop) {
    delete headers[name];
  }

  // Let undici/fetch manage these for the upstream request.
  delete headers['content-length'];
  delete headers['accept-encoding'];

  // Forwarding metadata for upstream.
  headers['x-forwarded-host'] = incomingUrl.host;
  headers['x-forwarded-proto'] = incomingUrl.protocol.replace(':', '');
  headers['x-forwarded-prefix'] = '/api/proxy';
  const ip = getRequestIP(event);
  if (ip) {
    const prev = headers['x-forwarded-for'];
    headers['x-forwarded-for'] = prev ? `${prev}, ${ip}` : ip;
  }

  return proxyRequest(event, url, {
    streamRequest: true,
    onResponse: async (_event, response) => {
      if ((process.env.NUXT_PROXY_DEBUG || '').toLowerCase() === 'true') {
        console.log(`[proxy] upstream ${response.status} ${response.statusText} <- ${url}`);
      }
    },
    fetchOptions: {
      headers,
    },
  });
});
