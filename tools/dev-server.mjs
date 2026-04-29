import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const PORT = Number.parseInt(process.env.PORT || "4173", 10);
const HOST = process.env.HOST || "127.0.0.1";

const PROXY_TARGET = process.env.PROXY_TARGET || "";
const PROXY_PREFIX = process.env.PROXY_PREFIX || "/api";

const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
]);

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "cache-control": "no-store",
    ...headers,
  });
  res.end(body);
}

function safeDecodeURIComponent(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return null;
  }
}

function toLocalPath(urlPathname) {
  const decoded = safeDecodeURIComponent(urlPathname);
  if (decoded == null) return null;

  // Strip query/hash already done by URL, normalize path separators.
  const cleaned = decoded.replaceAll("\\", "/");
  const withoutLeadingSlash = cleaned.replace(/^\/+/, "");
  const resolved = path.resolve(ROOT, withoutLeadingSlash);
  if (!resolved.startsWith(ROOT)) return null; // path traversal guard
  return resolved;
}

async function tryReadFile(filePath) {
  const st = await stat(filePath);
  if (st.isDirectory()) {
    const indexPath = path.join(filePath, "index.html");
    return await tryReadFile(indexPath);
  }
  const buf = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME.get(ext) || "application/octet-stream";
  return { buf, contentType };
}

async function proxy(req, res, targetOrigin) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const upstream = new URL(targetOrigin);

  const upstreamUrl = new URL(upstream.origin);
  upstreamUrl.pathname = url.pathname;
  upstreamUrl.search = url.search;

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = chunks.length ? Buffer.concat(chunks) : undefined;

  const headers = { ...req.headers };
  delete headers.host;

  const upstreamRes = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body: body,
    redirect: "manual",
  });

  const passthroughHeaders = {};
  upstreamRes.headers.forEach((value, key) => {
    // Avoid invalid/managed-by-node headers.
    if (key.toLowerCase() === "transfer-encoding") return;
    passthroughHeaders[key] = value;
  });

  res.writeHead(upstreamRes.status, passthroughHeaders);
  const ab = await upstreamRes.arrayBuffer();
  res.end(Buffer.from(ab));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (PROXY_TARGET && url.pathname.startsWith(PROXY_PREFIX)) {
      await proxy(req, res, PROXY_TARGET);
      return;
    }

    const pathname = url.pathname === "/" ? "/login.html" : url.pathname;
    const filePath = toLocalPath(pathname);
    if (!filePath) {
      send(res, 400, "Bad Request");
      return;
    }

    const { buf, contentType } = await tryReadFile(filePath);
    send(res, 200, buf, { "content-type": contentType });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "ENOENT") {
      send(res, 404, "Not Found");
      return;
    }
    send(res, 500, "Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  // Keep output minimal & copyable on Windows terminals.
  console.log(`Serving: http://${HOST}:${PORT}/login.html`);
  if (PROXY_TARGET) {
    console.log(`Proxy:   ${PROXY_PREFIX} -> ${PROXY_TARGET}`);
  }
});

