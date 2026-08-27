import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

// Receives one photo from the enquiry form and returns a public URL for it,
// so the URL can be dropped into the WhatsApp message as a tappable link.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const type = req.headers.get("content-type") || "";
  if (!type.startsWith("image/")) return new Response("Images only", { status: 415 });

  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.byteLength)            return new Response("Empty", { status: 400 });
  if (bytes.byteLength > 5_000_000) return new Response("Too large", { status: 413 });

  const id = randomUUID();
  await getStore("enquiry-photos").set(id, bytes, { metadata: { type } });

  return Response.json({ url: new URL(req.url).origin + "/p/" + id });
};

export const config = { path: "/api/upload" };
