import archive from './assets.bin';
const files = __ASSET_MANIFEST__;
const primaryHost = 'southerncrescenthospitality.com';
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
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
