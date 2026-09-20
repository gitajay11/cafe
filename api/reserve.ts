/**
 * Vercel serverless function (Node runtime, Web-standard signature).
 * Deployed automatically from the `api/` folder when this repo is on Vercel.
 * Set the SMTP_* / MAIL_* environment variables in the Vercel project.
 */
import { handleReservation } from "../server/reservation.ts";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleReservation(body);
  return Response.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
