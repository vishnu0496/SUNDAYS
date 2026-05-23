import fs from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

export interface ReviewEntry {
  id: string;
  name: string;
  rating: number;
  message: string;
  imageDataUrl?: string;
  createdAt: string;
}

const REVIEWS_BLOB_KEY = "reviews";
const getReviewsPath = () => path.join(process.cwd(), "reviews.json");

function isNetlifyRuntime() {
  return Boolean(process.env.NETLIFY_BLOBS_CONTEXT || process.cwd().startsWith("/var/task"));
}

function isVercelKV() {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function runKVCommand(command: any[]) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`KV command failed: ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("KV command error:", err);
    return null;
  }
}

function getReviewsStore() {
  return getStore("sundays-reviews");
}

export async function getReviews(): Promise<ReviewEntry[]> {
  if (isNetlifyRuntime()) {
    return (await getReviewsStore().get(REVIEWS_BLOB_KEY, { type: "json" })) ?? [];
  }

  if (isVercelKV()) {
    const result = await runKVCommand(["GET", REVIEWS_BLOB_KEY]);
    if (result && typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch {
        return [];
      }
    }
    return [];
  }

  try {
    const data = await fs.readFile(getReviewsPath(), "utf-8");
    return JSON.parse(data);
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function saveReview(input: Omit<ReviewEntry, "id" | "createdAt">) {
  const reviews = await getReviews();
  const review: ReviewEntry = {
    ...input,
    id: `review_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const nextReviews = [review, ...reviews].slice(0, 24);

  if (isNetlifyRuntime()) {
    await getReviewsStore().setJSON(REVIEWS_BLOB_KEY, nextReviews);
  } else if (isVercelKV()) {
    await runKVCommand(["SET", REVIEWS_BLOB_KEY, JSON.stringify(nextReviews)]);
  } else {
    await fs.writeFile(getReviewsPath(), JSON.stringify(nextReviews, null, 2), "utf-8");
  }

  return review;
}
