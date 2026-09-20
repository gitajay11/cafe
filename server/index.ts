/**
 * Minimal reservation API for local development and self-hosting.
 *
 *   npm run server          → http://localhost:8790
 *   POST /api/reserve       → JSON body, see src/lib/reservationSchema.ts
 *   GET  /api/health        → { ok, mailConfigured }
 *
 * Vite proxies /api to this server in development (vite.config.ts). In
 * production put it behind your reverse proxy on the same origin, or set
 * VITE_RESERVATION_ENDPOINT on the frontend and ALLOWED_ORIGIN here.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { handleReservation, isMailConfigured } from "./reservation.ts";

const PORT = Number(process.env.PORT ?? 8790);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "";
const MAX_BODY = 16 * 1024;

/* Very small per-IP rate limit: 6 requests per minute. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown, origin?: string) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const origin = req.headers.origin;
  const corsOrigin = ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN ? origin : undefined;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...(corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin, Vary: "Origin" } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    });
    return res.end();
  }

  if (url.pathname === "/api/health" && req.method === "GET") {
    return send(res, 200, { ok: true, mailConfigured: isMailConfigured() }, corsOrigin);
  }

  if (url.pathname === "/api/reserve" && req.method === "POST") {
    const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    if (rateLimited(ip)) return send(res, 429, { ok: false, error: "Too many requests — please try again in a minute." }, corsOrigin);

    let body: unknown;
    try {
      body = await readJson(req);
    } catch (error) {
      return send(res, 400, { ok: false, error: (error as Error).message }, corsOrigin);
    }

    const result = await handleReservation(body);
    return send(res, result.status, result.body, corsOrigin);
  }

  send(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Reservation API listening on http://localhost:${PORT}`);
  console.log(isMailConfigured() ? "Mail: configured" : "Mail: NOT configured — set SMTP_* / MAIL_* in .env (or MAIL_DRY_RUN=true)");
});
