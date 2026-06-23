import type { Handler } from '@netlify/functions';

// Server-side only — these are NOT VITE_-prefixed, so they never reach the client bundle.
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  let fields: Record<string, unknown>;
  try {
    const body = JSON.parse(event.body || '{}');
    fields = body.fields;
    if (!fields || typeof fields !== 'object') throw new Error('Missing fields');
  } catch {
    return { statusCode: 400, body: 'Invalid request body' };
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
