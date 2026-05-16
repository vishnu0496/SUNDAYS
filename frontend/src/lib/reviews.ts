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

function getReviewsStore() {
  return getStore("sundays-reviews");
}

export async function getReviews(): Promise<ReviewEntry[]> {
  if (isNetlifyRuntime()) {
    return (await getReviewsStore().get(REVIEWS_BLOB_KEY, { type: "json" })) ?? [];
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
  } else {
    await fs.writeFile(getReviewsPath(), JSON.stringify(nextReviews, null, 2), "utf-8");
  }

  return review;
}
