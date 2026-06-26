import type { Handler } from '@netlify/functions';

// Server-side only — these are NOT VITE_-prefixed, so they never reach the client bundle.
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

// Whitelist of fields the feedback form actually sends — see src/lib/feedback.ts.
// Anything outside this list is silently dropped rather than forwarded to Airtable,
// so a caller hitting this endpoint directly can't inject arbitrary field names.
const ALLOWED_FIELDS = new Set([
  'Submitted At',
  'Stories Played',
  'Prior Training',
  'Confidence Before',
  'Confidence After',
  'Realistic & True to Life',
  'Tone Appropriate',
  'Engaging',
  'Learned Something New',
  'Respected Seriousness',
  'Takeaway',
  'What Was Missing',
  'Who Would Benefit',
  'Role',
  'Organisation Type',
  'Would Org Use This',
  'Suggestions',
  "Jamie's Story — Reflection",
  "Lazlo's Story — Reflection",
]);

const MAX_STRING_LENGTH = 5000;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    return { statusCode: 500, body: 'Server misconfigured' };
  }
  if ((event.body?.length ?? 0) > 20000) {
    return { statusCode: 413, body: 'Payload too large' };
  }

  let rawFields: Record<string, unknown>;
  try {
    const body = JSON.parse(event.body || '{}');
    rawFields = body.fields;
    if (!rawFields || typeof rawFields !== 'object') throw new Error('Missing fields');
  } catch {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const fields: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(rawFields)) {
    if (!ALLOWED_FIELDS.has(key)) continue;
    if (typeof value === 'number' && Number.isFinite(value)) {
      fields[key] = value;
    } else if (typeof value === 'string') {
      fields[key] = value.slice(0, MAX_STRING_LENGTH);
    }
  }
  if (Object.keys(fields).length === 0) {
    return { statusCode: 400, body: 'No valid fields provided' };
  }

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 502, body: `Airtable submission failed: ${err}` };
  }

  return { statusCode: 200, body: 'OK' };
};
