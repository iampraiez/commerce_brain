import { getDB } from "@/lib/db";

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  windowSeconds: number
) {
  const db = await getDB();
  const collection = db.collection("rate_limits");

  // Create TTL index if it doesn't exist (this is idempotent)
  // We set expireAfterSeconds to 0 so documents expire at the 'expiresAt' time
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const key = `${ip}:${endpoint}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  // Atomically increment the counter and set expiration if it's a new document
  const result = await collection.findOneAndUpdate(
    { _id: key } as any,
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt },
    },
    { upsert: true, returnDocument: "after" }
  );

  // If the document was just created, result.value (or result) will have count: 1
  // If it existed, count will be incremented.
  // Note: findOneAndUpdate returns the document.
  // In MongoDB driver v6+, result is the document directly or result.value depending on options.
  // Assuming standard behavior or checking result structure.
  
  const currentCount = result?.count || result?.value?.count || 1;

  if (currentCount > limit) {
    throw new Error("Rate limit exceeded");
  }
}
