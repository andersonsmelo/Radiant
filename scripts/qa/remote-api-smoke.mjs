import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';

const DEFAULT_BASE_URL = 'https://api.radiant.ascendcreative.com.br';
const DEFAULT_TIMEOUT_MS = 10_000;

function normalizeBaseUrl(value) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/+$/, '');
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

function createFailure(id, label, error) {
  return {
    id,
    label,
    ok: false,
    message: error instanceof Error ? error.message : String(error),
  };
}

async function fetchJson({ fetchImpl, url, timeoutMs, lookup }) {
  if (!fetchImpl) {
    return requestJson({ url, timeoutMs, lookup });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers?.get?.('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, got "${contentType || 'unknown'}"`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function requestJson({ url, timeoutMs, lookup }) {
  const target = new URL(url);
  const transport = target.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const request = transport.request(
      target,
      {
        headers: { Accept: 'application/json' },
        lookup,
        timeout: timeoutMs,
      },
      (response) => {
        const chunks = [];

        response.setEncoding('utf8');
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const statusCode = response.statusCode ?? 0;
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`HTTP ${statusCode}`));
            return;
          }

          const contentType = response.headers['content-type'] ?? '';
          if (!contentType.includes('application/json')) {
            reject(new Error(`Expected JSON response, got "${contentType || 'unknown'}"`));
            return;
          }

          try {
            resolve(JSON.parse(chunks.join('')));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on('timeout', () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });
    request.on('error', reject);
    request.end();
  });
}

async function resolveARecord(host) {
  const addresses = await dns.resolve4(host);

  if (!addresses.length) {
    throw new Error(`No A records found for ${host}`);
  }

  return {
    address: addresses[0],
    addresses,
    family: 4,
  };
}

function describeLookupResult(result) {
  if (Array.isArray(result)) {
    return `${result.length} records`;
  }

  if (Array.isArray(result.addresses)) {
    return `${result.addresses.length} A records (${result.addresses.join(', ')})`;
  }

  return `${result.address} (${result.family})`;
}

function createRequestLookup({ host, lookupResult, lookup }) {
  const respond = (options, callback, result) => {
    if (options?.all) {
      callback(null, [{ address: result.address, family: result.family ?? 4 }]);
      return;
    }

    callback(null, result.address, result.family ?? 4);
  };

  return (hostname, options, callback) => {
    const done = typeof options === 'function' ? options : callback;
    const lookupOptions = typeof options === 'function' ? {} : options;

    if (hostname === host && lookupResult?.address) {
      respond(lookupOptions, done, lookupResult);
      return;
    }

    lookup(hostname)
      .then((result) => {
        if (Array.isArray(result)) {
          respond(lookupOptions, done, { address: result[0], family: 4 });
          return;
        }

        respond(lookupOptions, done, result);
      })
      .catch(done);
  };
}

function validateCatalog(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Catalog payload is not an object');
  }

  if (typeof payload.version !== 'string' || payload.version.length === 0) {
    throw new Error('Catalog payload is missing version');
  }

  if (!Array.isArray(payload.tracks) || payload.tracks.length === 0) {
    throw new Error('Catalog payload is missing tracks');
  }

  if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) {
    throw new Error('Catalog payload is missing lessons');
  }
}

export async function runRemoteApiSmoke({
  baseUrl = process.env.RADIANT_API_BASE_URL ?? DEFAULT_BASE_URL,
  lookup = resolveARecord,
  fetchImpl = null,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const host = new URL(normalizedBaseUrl).hostname;
  const checks = [];
  let lookupResult;

  try {
    lookupResult = await lookup(host);
    checks.push({
      id: 'dns',
      label: `DNS ${host}`,
      ok: true,
      message: describeLookupResult(lookupResult),
    });
  } catch (error) {
    checks.push(createFailure('dns', `DNS ${host}`, error));
    return { baseUrl: normalizedBaseUrl, ok: false, checks };
  }

  const requestLookup = createRequestLookup({ host, lookupResult, lookup });

  const endpoints = [
    {
      id: 'health',
      label: 'GET /health',
      path: '/health',
      validate(payload) {
        if (!payload || payload.ok !== true) {
          throw new Error('/health did not return ok=true');
        }
      },
    },
    {
      id: 'ready',
      label: 'GET /ready',
      path: '/ready',
      validate(payload) {
        if (!payload || payload.ok !== true) {
          throw new Error('/ready did not return ok=true');
        }
      },
    },
    {
      id: 'catalog',
      label: 'GET /v1/content/catalog',
      path: '/v1/content/catalog',
      validate: validateCatalog,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const payload = await fetchJson({
        fetchImpl,
        url: `${normalizedBaseUrl}${endpoint.path}`,
        timeoutMs,
        lookup: requestLookup,
      });
      endpoint.validate(payload);
      checks.push({
        id: endpoint.id,
        label: endpoint.label,
        ok: true,
        message: 'contract ok',
      });
    } catch (error) {
      checks.push(createFailure(endpoint.id, endpoint.label, error));
    }
  }

  return {
    baseUrl: normalizedBaseUrl,
    ok: checks.every((check) => check.ok),
    checks,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = await runRemoteApiSmoke();
  console.log(`Remote API smoke: ${summary.baseUrl}`);

  for (const check of summary.checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.label}: ${check.message}`);
  }

  process.exit(summary.ok ? 0 : 1);
}
