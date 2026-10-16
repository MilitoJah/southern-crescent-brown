import archive from './assets.bin';
const files = __ASSET_MANIFEST__;
const primaryHost = 'southerncrescenthospitality.com';

// Website inquiries are submitted server side to the Microsoft Form
// "Southern Crescent Hospitality — Event Inquiry". The Power Automate flow on
// that form then emails hello@ and sends the client a thank you.
const FORM_ENDPOINT = "https://forms.cloud.microsoft/formapi/api/d2a5e4b7-5ed4-4ab4-a3e0-527f297e4581/users/b10e8717-5a35-4ee4-a04f-ee2042d79e2f/forms('t-Sl0tRetEqj4FJ_KX5FgReHDrE1WuROoE_uIELXni9URDBUQzUwRU9HQTYyWjkwME9XQVlISFlGQy4u')/responses";
const QUESTION_IDS = {
  name: 'r26466f46c7c84e5a9180b47ec1d4bd4f', email: 'r47d357f7da28406589b569940bb1d156',
  phone: 'rff773bf76a32464b92d32996f7dbfa9b', company: 're25037f9e864492db18f3afcaa38f04d',
  address: 'r2d4f420e4a8a4a89ad72ed9c37f5e260', postal: 'r88633737c622414c82edcda539198261',
  city: 'r6ad7abcfb2464b2085b93ca36d8246ce', state: 'rd2844cb82d2440a38fe468a5d5e8df6e',
  service: 'r55ca1d4b18aa4a149c31a613eac70fd3', date: 'rc632f1257c8a4c489d2419ae0a290eb4',
  location: 'rbd3d942a8cde4b8cb1e0462752e139a6', start: 'r6f4771e6d1954aa5884df0742dd7c779',
  end: 'r91067eea10a249b0beaed4496456b624', guests: 'rdc1451f65f3443068b5f6e8db6e35900',
  budget: 'r605df051585441cf9832a24110fc8f3f', referral: 'r5cbe01a2a7cb4ac49bbec8a7db86c226',
  details: 'r5cd52b45ed4142b19cb8e322b7a6b9ce'
};
const SERVICES = {
  'corporate-catering': 'Corporate catering', 'meeting-catering': 'Meeting catering',
  'drop-off-catering': 'Delivered meals / boxed-meal inquiry', 'charcuterie-grazing': 'Charcuterie & curated grazing',
  'bar-and-beverage': 'Beverage & dry hire bar', 'event-planning': 'Event planning & management',
  'hospitality-professionals': 'Staffing & hospitality', 'catering-menus': 'Menu planning',
  'other': 'A combination / something else'
};
const LIMITS = {name: 120, email: 254, phone: 40, company: 160, address: 240, postal: 20, city: 100, state: 80, location: 240, budget: 100, referral: 160, details: 4000};
const REQUIRED = ['name', 'email', 'company', 'date', 'location', 'guests', 'service'];

function json(body, status) {
  return new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}});
}
function to12Hour(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return '';
  const hours = Number(match[1]);
  if (hours > 23 || Number(match[2]) > 59) return '';
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? 'AM' : 'PM'}`;
}
function formatBudget(value) {
  return /^\d[\d,]*(\.\d{1,2})?$/.test(value) ? '$' + value : value;
}
async function handleInquiry(request, url) {
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).hostname !== url.hostname) return json({ok: false, error: 'origin'}, 403);
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 20000) return json({ok: false, error: 'too-large'}, 413);
  let input;
  try { input = await request.json(); } catch { return json({ok: false, error: 'invalid'}, 400); }
  if (!input || typeof input !== 'object') return json({ok: false, error: 'invalid'}, 400);
  // Hidden field that people never see; bots that fill it get a quiet success.
  if (String(input.website || '').trim()) return json({ok: true}, 200);
  const value = key => String(input[key] ?? '').trim().slice(0, LIMITS[key] || 40);
  const fields = {};
  for (const key of Object.keys(QUESTION_IDS)) fields[key] = value(key);
  const missing = REQUIRED.filter(key => !fields[key]);
  if (missing.length) return json({ok: false, error: 'missing', fields: missing}, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return json({ok: false, error: 'email'}, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) return json({ok: false, error: 'date'}, 400);
  const guests = Number(fields.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 100000) return json({ok: false, error: 'guests'}, 400);
  fields.guests = String(guests);
  if (!Object.hasOwn(SERVICES, fields.service)) return json({ok: false, error: 'service'}, 400);
  // Retain compatibility with the existing Microsoft Form's required questions.
  // These are explicit non-answers, not invented customer contact/billing details.
  for (const key of ['address', 'postal', 'city', 'state', 'referral']) {
    fields[key] = 'Not collected at initial quote stage';
  }
  if (!fields.phone) fields.phone = 'Not provided; reply by email';
  if (!fields.budget) fields.budget = 'To discuss';
  fields.service = SERVICES[fields.service];
  fields.start = to12Hour(fields.start);
  fields.end = to12Hour(fields.end);
  fields.budget = formatBudget(fields.budget);
  const answers = Object.entries(QUESTION_IDS)
    .filter(([key]) => fields[key])
    .map(([key, questionId]) => ({questionId, answer1: fields[key]}));
  const now = new Date().toISOString();
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({startDate: now, submitDate: now, answers: JSON.stringify(answers)})
    });
    if (response.status !== 201 && response.status !== 200) {
      console.log('Forms submission failed', response.status, (await response.text()).slice(0, 300));
      return json({ok: false, error: 'upstream'}, 502);
    }
  } catch (error) {
    console.log('Forms submission error', String(error));
    return json({ok: false, error: 'upstream'}, 502);
  }
  return json({ok: true}, 200);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === '/api/inquiry') {
      if (request.method !== 'POST') return new Response('Method not allowed', {status: 405, headers: {Allow: 'POST'}});
      return handleInquiry(request, url);
    }
    const knownHost = [primaryHost, 'www.' + primaryHost, 'southern-crescent-brown.haja-jah.workers.dev'].includes(url.hostname);
    let canonicalPath = path;
    if (path === '/index.html') canonicalPath = '/';
    else if (!path.endsWith('/') && files[path + '.html']) canonicalPath = path + '.html';
    if (knownHost && (url.hostname !== primaryHost || url.protocol !== 'https:' || canonicalPath !== path)) {
      url.hostname = primaryHost;
      url.protocol = 'https:';
      url.port = '';
      url.pathname = canonicalPath;
      return new Response(null, {status: 308, headers: {Location: url.href}});
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', {status: 405, headers: {Allow: 'GET, HEAD'}});
    }
    const found = files[path === '/' ? '/index.html' : path];
    const file = found || files['/404.html'];
    if (!file) return new Response('Not found', {status: 404});
    const headers = {'Content-Type': file.type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=60'};
    if (!found) headers['X-Robots-Tag'] = 'noindex';
    return new Response(request.method === 'HEAD' ? null : new Uint8Array(archive, file.offset, file.length), {status: found ? 200 : 404, headers});
  }
};
