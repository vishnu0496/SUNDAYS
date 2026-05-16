import { NextResponse } from "next/server";
import { getReviews, saveReview } from "@/lib/reviews";

export const runtime = "nodejs";

const MAX_IMAGE_LENGTH = 2_800_000;

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json({ success: false, error: "Could not fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 80);
    const message = String(body.message || "").trim().slice(0, 700);
    const rating = Number(body.rating);
    const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : undefined;

    if (!name || !message || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Please add your name, rating, and review." }, { status: 400 });
    }

    if (imageDataUrl && (!imageDataUrl.startsWith("data:image/") || imageDataUrl.length > MAX_IMAGE_LENGTH)) {
      return NextResponse.json({ success: false, error: "Please upload a smaller image." }, { status: 400 });
    }

    const review = await saveReview({ name, message, rating, imageDataUrl });
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review save error:", error);
    return NextResponse.json({ success: false, error: "Could not save review" }, { status: 500 });
  }
}
