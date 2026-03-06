"use client";

import { DocSection, EndpointBar, CodeBlock, ParamTable, Badge, IC, Callout } from "./DocsUI";

// ─── Shared sample response ────────────────────────────────────────────────────
const SAMPLE_RESPONSE = `{
  "timestamp": 1772823460945,
  "data": {
    "ip": "185.153.11.146",
    "geo": {
      "ip": null,
      "country": "FR",
      "countryName": "France",
      "region": "HDF",
      "regionName": "Hauts-de-France",
      "city": "Sainghin-en-Mélantois",
      "zip": "59262",
      "ll": [48.8582, 2.3387],
      "lat": 48.8582,
      "lon": 2.3387,
      "timezone": "Europe/Paris",
      "eu": "1",
      "metro": 0,
      "area": 500,
      "range": [3113814016, 3113815039],
      "isp": "SAS Nexylan",
      "org": "SAS Nexylan",
      "as": "AS199758 SAS Nexylan",
      "mobile": false,
      "proxy": false,
      "hosting": true
    }
  }
}`;

// ─── Field reference rows ──────────────────────────────────────────────────────
const TOP_LEVEL_FIELDS = [
  { name: "timestamp", type: "number",  description: "Unix timestamp (ms) of when the request was processed.", example: "1772823460945" },
  { name: "data",      type: "object",  description: "Container object holding the IP and geo sub-objects." },
  { name: "data.ip",   type: "string",  description: "The resolved IP address that was looked up.", example: "185.153.11.146" },
  { name: "data.geo",  type: "object",  description: "Full geolocation record for the IP." },
];

const GEO_FIELDS = [
  { name: "country",     type: "string",   description: "ISO 3166-1 alpha-2 country code.",          example: '"FR"' },
  { name: "countryName", type: "string",   description: "Full country name.",                         example: '"France"' },
  { name: "region",      type: "string",   description: "ISO 3166-2 subdivision code.",               example: '"HDF"' },
  { name: "regionName",  type: "string",   description: "Full region / state / province name.",       example: '"Hauts-de-France"' },
  { name: "city",        type: "string",   description: "City name. Empty string if unavailable.",    example: '"Sainghin-en-Mélantois"' },
  { name: "zip",         type: "string",   description: "Postal / ZIP code. Empty string if unavailable.", example: '"59262"' },
  { name: "lat",         type: "number",   description: "Latitude in decimal degrees (full precision).", example: "48.8582" },
  { name: "lon",         type: "number",   description: "Longitude in decimal degrees (full precision).", example: "2.3387" },
  { name: "ll",          type: "number[]", description: "Convenience array [lat, lon]. May be rounded — prefer lat/lon for precision.", example: "[48.8582, 2.3387]" },
  { name: "timezone",    type: "string",   description: "IANA timezone identifier.",                  example: '"Europe/Paris"' },
  { name: "eu",          type: "string",   description: '"1" if the country is an EU member, "0" otherwise.', example: '"1"' },
  { name: "metro",       type: "number",   description: "DMA metro code (US only). 0 elsewhere.",    example: "0" },
  { name: "area",        type: "number",   description: "Approximate accuracy radius in kilometres.", example: "500" },
  { name: "range",       type: "number[]", description: "Start and end of the IP's numeric range.",  example: "[3113814016, 3113815039]" },
  { name: "isp",         type: "string",   description: "Internet Service Provider name.",           example: '"SAS Nexylan"' },
  { name: "org",         type: "string",   description: "Organisation name registered to the IP.",   example: '"SAS Nexylan"' },
  { name: "as",          type: "string",   description: "ASN and organisation label.",               example: '"AS199758 SAS Nexylan"' },
  { name: "mobile",      type: "boolean",  description: "true if the IP belongs to a mobile network." },
  { name: "proxy",       type: "boolean",  description: "true if the IP is a known proxy or VPN exit node." },
  { name: "hosting",     type: "boolean",  description: "true if the IP belongs to a datacenter or hosting provider." },
];

const ERROR_ROWS = [
  { name: "400", type: "Bad Request",           description: "The supplied value is not a valid IPv4 or IPv6 address." },
  { name: "404", type: "Not Found",             description: "The IP exists but could not be resolved to any geo record." },
  { name: "429", type: "Too Many Requests",     description: "Rate limit exceeded. Slow down and retry after 1 minute." },
  { name: "500", type: "Internal Server Error", description: "An unexpected server-side error occurred." },
];

// ─── Code examples ─────────────────────────────────────────────────────────────
const CURL_AUTO   = `curl https://ip-geo-backend.onrender.com/api/ip-geo/v1/`;
const CURL_LOOKUP = `curl https://ip-geo-backend.onrender.com/api/ip-geo/v1/185.153.11.146`;

const JS_AUTO = `const res  = await fetch('https://ip-geo-backend.onrender.com/api/ip-geo/v1/');
const json = await res.json();

const { ip, geo } = json.data;
console.log(geo.city);        // "San Francisco"
console.log(geo.countryName); // "United States"
console.log(geo.lat, geo.lon);// 37.7749  -122.4194
console.log(geo.isp);         // "Comcast Cable"`;

const JS_LOOKUP = `const ip   = '185.153.11.146';
const res  = await fetch(\`https://ip-geo-backend.onrender.com/api/ip-geo/v1/\${ip}\`);
const json = await res.json();

const geo = json.data.geo;
console.log(geo.countryName); // "France"
console.log(geo.regionName);  // "Hauts-de-France"
console.log(geo.hosting);     // true`;

const PY_AUTO = `import requests

r    = requests.get('https://ip-geo-backend.onrender.com/api/ip-geo/v1/')
data = r.json()['data']

print(data['ip'])               # your IP
print(data['geo']['city'])      # city name
print(data['geo']['lat'])       # latitude
print(data['geo']['lon'])       # longitude`;

const PY_LOOKUP = `import requests

ip   = '185.153.11.146'
r    = requests.get(f'https://ip-geo-backend.onrender.com/api/ip-geo/v1/{ip}')
geo  = r.json()['data']['geo']

print(geo['countryName'])  # France
print(geo['regionName'])   # Hauts-de-France
print(geo['isp'])          # SAS Nexylan`;

const PHP = `<?php
$res  = file_get_contents('https://ip-geo-backend.onrender.com/api/ip-geo/v1/');
$data = json_decode($res, true)['data'];

echo $data['ip'];               // your IP
echo $data['geo']['city'];      // city name
echo $data['geo']['countryName']; // country`;

const NODE_SERVER = `// Express middleware — tag every request with geo data
import express from 'express';

const app = express();

app.use(async (req, res, next) => {
  const ip  = req.ip.replace('::ffff:', ''); // strip IPv4-mapped prefix
  const geo = await fetch(\`https://ip-geo-backend.onrender.com/api/ip-geo/v1/\${ip}\`)
                    .then(r => r.json())
                    .then(j => j.data.geo)
                    .catch(() => null);

  req.geo = geo; // attach to request object
  next();
});

app.get('/', (req, res) => {
  res.json({ city: req.geo?.city, country: req.geo?.countryName });
});`;

export default function DocsContent({ activeSection }) {
  const show = (id) => activeSection === id;

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">

      {/* ── Introduction ── */}
      {show("introduction") && (
        <DocSection id="introduction" subtitle="Getting Started" title="Introduction">
          <p>
            IPGEO.API is a free, open IP geolocation REST API. Pass any valid IPv4 or IPv6 address
            and receive structured JSON with location, network, and metadata — no authentication required.
          </p>
          <Callout type="tip">
            No API keys, no sign-ups, no rate-limit surprises. Just make the request.
          </Callout>
          <p>
            The API is built on <IC>geoip-lite</IC> enriched with real-time fallback data from <IC>ip-api.com</IC>,
            giving you the best coverage possible — including city, region, ISP, and network flags
            that the free MaxMind database alone doesn&apos;t always provide.
          </p>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Base URL</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-[#00ff9d]">
            https://ip-geo-backend.onrender.com/api/ip-geo/v1
          </div>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Available Endpoints</h3>
          <ParamTable rows={[
            { name: "GET /v1/",     type: "auto",   description: "Detects and resolves the caller's own IP address." },
            { name: "GET /v1/{ip}", type: "lookup", description: "Resolves any specific IPv4 or IPv6 address you supply." },
          ]} />
        </DocSection>
      )}

      {/* ── Quick Start ── */}
      {show("quickstart") && (
        <DocSection id="quickstart" subtitle="Getting Started" title="Quick Start">
          <p>You can be up and running in under 60 seconds. No setup needed.</p>

          <h3 className="font-mono text-white font-bold mt-8 mb-2">1. Detect your own IP</h3>
          <p>Leave the path empty — the API auto-detects the calling IP.</p>
          <CodeBlock tabs={[
            { lang: "cURL",       code: CURL_AUTO },
            { lang: "JavaScript", code: JS_AUTO },
            { lang: "Python",     code: PY_AUTO },
            { lang: "PHP",        code: PHP },
          ]} />

          <h3 className="font-mono text-white font-bold mt-8 mb-2">2. Look up any IP</h3>
          <p>Append the IP address directly to the path.</p>
          <CodeBlock tabs={[
            { lang: "cURL",       code: CURL_LOOKUP },
            { lang: "JavaScript", code: JS_LOOKUP },
            { lang: "Python",     code: PY_LOOKUP },
          ]} />

          <h3 className="font-mono text-white font-bold mt-8 mb-2">3. Use the data</h3>
          <p>Parse the JSON response — every field is described in the <IC>Field Reference</IC> section.</p>
          <CodeBlock tabs={[{ lang: "Response", code: SAMPLE_RESPONSE }]} />
        </DocSection>
      )}

      {/* ── Authentication ── */}
      {show("authentication") && (
        <DocSection id="authentication" subtitle="Getting Started" title="Authentication">
          <Callout type="tip">
            This API requires no authentication. There are no API keys to manage.
          </Callout>
          <p>
            All endpoints are publicly accessible. Simply make a standard HTTP GET request — no
            <IC>Authorization</IC> header, no token, no account.
          </p>
          <p>
            If you&apos;re self-hosting this API, you can add your own key-based middleware at the
            Express layer. The geolocation logic itself is completely independent.
          </p>
          <h3 className="font-mono text-white font-bold mt-8 mb-3">CORS</h3>
          <p>
            All responses include <IC>Access-Control-Allow-Origin: *</IC> so you can call the API
            directly from browser JavaScript without a proxy.
          </p>
        </DocSection>
      )}

      {/* ── Auto-detect endpoint ── */}
      {show("auto-detect") && (
        <DocSection id="auto-detect" subtitle="Endpoints" title="Auto-Detect IP">
          <EndpointBar method="GET" path="https://ip-geo-backend.onrender.com/api/ip-geo/v1/" />
          <p>
            Resolves the IP address of the client making the request. The server reads the
            <IC>X-Forwarded-For</IC> header first, then <IC>X-Real-IP</IC>, and falls back to the
            direct socket IP.
          </p>

          <Callout type="info">
            When testing locally (<IC>127.0.0.1</IC> or <IC>::1</IC>), the API will return a
            limited response — geo data is only available for public IP addresses.
          </Callout>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Path Parameters</h3>
          <p className="text-zinc-600 font-mono text-xs">None — the IP is inferred from the request.</p>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Example Request</h3>
          <CodeBlock tabs={[
            { lang: "cURL",       code: CURL_AUTO },
            { lang: "JavaScript", code: JS_AUTO },
            { lang: "Python",     code: PY_AUTO },
          ]} />

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Example Response</h3>
          <CodeBlock tabs={[{ lang: "JSON", code: SAMPLE_RESPONSE }]} />
        </DocSection>
      )}

      {/* ── Lookup IP endpoint ── */}
      {show("lookup-ip") && (
        <DocSection id="lookup-ip" subtitle="Endpoints" title="Lookup IP">
          <EndpointBar method="GET" path="https://ip-geo-backend.onrender.com/api/ip-geo/v1/{ip}" />
          <p>
            Resolves a specific IP address you supply in the path. Accepts both IPv4
            (<IC>185.153.11.146</IC>) and IPv6 (<IC>2001:db8::1</IC>) formats.
          </p>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Path Parameters</h3>
          <ParamTable rows={[
            {
              name: "ip",
              type: "string",
              required: true,
              description: "A valid IPv4 or IPv6 address to look up.",
              example: "185.153.11.146",
            },
          ]} />

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Example Request</h3>
          <CodeBlock tabs={[
            { lang: "cURL",       code: CURL_LOOKUP },
            { lang: "JavaScript", code: JS_LOOKUP },
            { lang: "Python",     code: PY_LOOKUP },
          ]} />

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Example Response</h3>
          <CodeBlock tabs={[{ lang: "JSON", code: SAMPLE_RESPONSE }]} />
        </DocSection>
      )}

      {/* ── Data structure ── */}
      {show("data-structure") && (
        <DocSection id="data-structure" subtitle="Response" title="Data Structure">
          <p>Every response follows the same envelope regardless of endpoint.</p>
          <CodeBlock tabs={[{ lang: "Schema", code: `{
  "timestamp": number,    // Unix ms — when the request was processed
  "data": {
    "ip":  string,        // The resolved IP address
    "geo": {
      // Location
      "country":     string,    // ISO alpha-2 code  e.g. "FR"
      "countryName": string,    // Full name         e.g. "France"
      "region":      string,    // Subdivision code  e.g. "HDF"
      "regionName":  string,    // Full region name  e.g. "Hauts-de-France"
      "city":        string,    // City name
      "zip":         string,    // Postal code
      // Coordinates
      "lat":         number,    // Latitude  (full precision)
      "lon":         number,    // Longitude (full precision)
      "ll":          number[],  // [lat, lon] convenience array
      "timezone":    string,    // IANA tz   e.g. "Europe/Paris"
      // Network
      "isp":         string,    // ISP name
      "org":         string,    // Organisation name
      "as":          string,    // ASN + label  e.g. "AS199758 SAS Nexylan"
      // Flags
      "eu":          string,    // "1" = EU member, "0" = not
      "mobile":      boolean,   // Mobile network?
      "proxy":       boolean,   // Known proxy / VPN?
      "hosting":     boolean,   // Datacenter / hosting?
      // Meta
      "metro":       number,    // DMA metro code (US only)
      "area":        number,    // Accuracy radius in km
      "range":       number[]   // [rangeStart, rangeEnd] numeric
    }
  }
}` }]} />
        </DocSection>
      )}

      {/* ── Field Reference ── */}
      {show("field-reference") && (
        <DocSection id="field-reference" subtitle="Response" title="Field Reference">
          <h3 className="font-mono text-white font-bold mb-3">Top-level fields</h3>
          <ParamTable rows={TOP_LEVEL_FIELDS} />

          <h3 className="font-mono text-white font-bold mt-10 mb-3">
            <IC>data.geo</IC> fields
          </h3>
          <ParamTable rows={GEO_FIELDS} />

          <Callout type="warning">
            <strong>lat / lon vs ll[]</strong> — Always use <IC>lat</IC> and <IC>lon</IC> for precise
            coordinates. The <IC>ll</IC> array is a convenience shorthand but may contain rounded integers
            depending on the underlying database record.
          </Callout>
        </DocSection>
      )}

      {/* ── Error codes ── */}
      {show("error-codes") && (
        <DocSection id="error-codes" subtitle="Response" title="Error Codes">
          <p>When a request cannot be fulfilled, the API returns a non-200 HTTP status code with a JSON error body.</p>

          <CodeBlock tabs={[{ lang: "Error shape", code: `{
  "error": "Invalid IP address",
  "status": 400
}` }]} />

          <ParamTable rows={ERROR_ROWS} />

          <Callout type="info">
            A <IC>404</IC> means the IP is valid but has no resolvable geo record — typically
            private ranges, reserved addresses, or very new allocations.
          </Callout>
        </DocSection>
      )}

      {/* ── Code Examples ── */}
      {show("code-examples") && (
        <DocSection id="code-examples" subtitle="Guides" title="Code Examples">
          <h3 className="font-mono text-white font-bold mb-2">Express.js Middleware</h3>
          <p>
            Tag every incoming request with geo data by attaching it to the <IC>req</IC> object.
          </p>
          <CodeBlock tabs={[{ lang: "Node.js", code: NODE_SERVER }]} />

          <h3 className="font-mono text-white font-bold mt-10 mb-2">Browser (Vanilla JS)</h3>
          <CodeBlock tabs={[{ lang: "JavaScript", code: JS_AUTO }]} />

          <h3 className="font-mono text-white font-bold mt-10 mb-2">Python (requests)</h3>
          <CodeBlock tabs={[
            { lang: "Auto-detect", code: PY_AUTO },
            { lang: "Lookup",      code: PY_LOOKUP },
          ]} />

          <h3 className="font-mono text-white font-bold mt-10 mb-2">PHP</h3>
          <CodeBlock tabs={[{ lang: "PHP", code: PHP }]} />
        </DocSection>
      )}

      {/* ── Rate Limits ── */}
      {show("rate-limits") && (
        <DocSection id="rate-limits" subtitle="Guides" title="Rate Limits">
          <p>
            The API itself imposes no hard rate limits on the public endpoints. However, the
            underlying <IC>ip-api.com</IC> fallback service — used to enrich responses when
            <IC>geoip-lite</IC> lacks city or region data — has a free-tier limit of
            <strong className="text-white"> 45 requests per minute</strong>.
          </p>

          <Callout type="warning">
            If you expect high traffic, add an in-memory or Redis cache keyed by IP. Most IPs
            don&apos;t change geo records — caching for 24 hours is safe and will keep you well inside
            the fallback limit.
          </Callout>

          <h3 className="font-mono text-white font-bold mt-8 mb-3">Recommended caching pattern</h3>
          <CodeBlock tabs={[{ lang: "Node.js", code: `// Simple in-memory cache with 24h TTL
const cache = new Map();

async function getGeoData(ip) {
  if (cache.has(ip)) return cache.get(ip);

  const res  = await fetch(\`/api/ip-geo/v1/\${ip}\`);
  const data = await res.json();

  cache.set(ip, data);
  setTimeout(() => cache.delete(ip), 24 * 60 * 60 * 1000);

  return data;
}` }]} />

          <ParamTable rows={[
            { name: "geoip-lite",  type: "local",    description: "No limit. Runs entirely in-process, no network call." },
            { name: "ip-api.com",  type: "fallback",  description: "45 req/min on the free tier. Only triggered when city/region is missing." },
            { name: "Public API",  type: "endpoint",  description: "No hard limit enforced at the API layer." },
          ]} />
        </DocSection>
      )}

    </div>
  );
}
