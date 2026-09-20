/**
 * Vercel Function (Node.js runtime, Web-standard signature).
 * Deployed automatically from the `api/` folder when this repo is on Vercel.
 * Set the SMTP_* / MAIL_* environment variables in the Vercel project.
 *
 * Imports use `.js` specifiers on purpose: Vercel compiles each .ts file to
 * .js and keeps specifiers verbatim; TypeScript (and tsx locally) map them
 * back to the .ts sources.
 */
import { handleReservation, isMailConfigured } from "../server/reservation.js";

const noStore = { "Cache-Control": "no-store" };

/** Health check: GET /api/reserve → { ok, mailConfigured } (never sends mail). */
export function GET(): Response {
  return Response.json({ ok: true, mailConfigured: isMailConfigured() }, { headers: noStore });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: noStore });
  }

  const result = await handleReservation(body);
  return Response.json(result.body, { status: result.status, headers: noStore });
}
