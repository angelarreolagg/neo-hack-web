import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/database";

/**
 * GET /api/events/[slug]
 * Fetches a single event by its URL-friendly slug.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    // Resolve dynamic route parameter
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    // Ensure database connection
    await connectToDatabase();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.trim() }).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
