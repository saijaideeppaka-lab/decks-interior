import { getStore } from "@netlify/blobs";

// Serves a stored enquiry photo. The id is a random UUID, so the URL is
// unguessable — unlisted rather than secret, which is the right level for
// "here is a photo of my living room wall".
export default async (req) => {
  const id = new URL(req.url).pathname.split("/").pop();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });

  const blob = await getStore("enquiry-photos").getWithMetadata(id, { type: "arrayBuffer" });
  if (!blob) return new Response("Not found", { status: 404 });

  return new Response(blob.data, {
    headers: {
      "content-type": blob.metadata?.type || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
};

export const config = { path: "/p/:id" };
