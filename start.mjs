#!/usr/bin/env node
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./web/', import.meta.url));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node start.mjs [--port 8080]\nOpen the printed local URL. Press Ctrl+C to stop.');
  process.exit(0);
}
if (args.length && (args.length !== 2 || args[0] !== '--port')) {
  console.error('Usage: node start.mjs [--port 8080]');
  process.exit(1);
}
const port = Number(args[1] ?? 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Port must be an integer between 1 and 65535.');
  process.exit(1);
}
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};
const server = http.createServer(async (req, res) => {
  const reply = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : body);
  };
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    reply(405, 'Method not allowed');
    return;
  }
  let filename;
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
    filename = path.resolve(root, '.' + pathname);
    if (filename !== path.resolve(root) && !filename.startsWith(root)) {
      reply(403, 'Forbidden');
      return;
    }
  } catch { reply(400, 'Invalid URL'); return; }
  try {
    let info = await stat(filename);
    if (info.isDirectory()) {
      filename = path.join(filename, 'index.html');
      info = await stat(filename);
    }
    if (!info.isFile()) { reply(404, 'Not found'); return; }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(filename)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(filename).on('error', () => res.destroy()).pipe(res);
  } catch { reply(404, 'Not found'); }
});
server.on('error', err => {
  console.error(err.code === 'EADDRINUSE'
    ? `Port ${port} is in use. Try: node start.mjs --port ${port < 65535 ? port + 1 : 8080}`
    : `Could not start server: ${err.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`\nHALE ATS local demo\nOpen http://127.0.0.1:${port}\nPress Ctrl+C to stop.\n`);
});
