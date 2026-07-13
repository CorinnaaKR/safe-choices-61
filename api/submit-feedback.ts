import type { VercelRequest, VercelResponse } from '@vercel/node';

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    return res.status(500).send('Server misconfigured');
  }

  const bodyStr = JSON.stringify(req.body);
  if (bodyStr.length > 20000) {
    return res.status(413).send('Payload too large');
  }

  let rawFields: Record<string, unknown>;
  try {
    rawFields = req.body?.fields;
    if (!rawFields || typeof rawFields !== 'object') throw new Error('Missing fields');
  } catch {
    return res.status(400).send('Invalid request body');
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
    return res.status(400).send('No valid fields provided');
  }

  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );

  if (!airtableRes.ok) {
    const err = await airtableRes.text();
    return res.status(502).send(`Airtable submission failed: ${err}`);
  }

  return res.status(200).send('OK');
}
