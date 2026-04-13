import mongoose, { Schema, type Document, type Model } from "mongoose";

/** Mongoose document interface for Event */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, enum: ["online", "offline", "hybrid"] },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: generates URL-friendly slug from title (only if title changed),
 * normalizes date to ISO format (YYYY-MM-DD), and normalizes time to 24h format.
 */
eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    // Generate slug from title: lowercase, replace spaces/special chars with hyphens
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (this.isModified("date")) {
    // Normalize date to ISO 8601 format (YYYY-MM-DD)
    const parsedDate = new Date(this.date);
    if (!isNaN(parsedDate.getTime())) {
      this.date = parsedDate.toISOString().split("T")[0];
    }
  }

  if (this.isModified("time")) {
    // Normalize time to 24h format (HH:MM) using Date parsing
    const timeMatch = this.time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const period = timeMatch[3]?.toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      this.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
  }

  // Validate required non-empty fields
  const requiredFields = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "agenda",
    "organizer",
    "tags",
  ];
  for (const field of requiredFields) {
    const value = this.get(field);
    if (value === undefined || value === null || value === "") {
      next(new Error(`${field} is required and cannot be empty`));
      return;
    }
  }

  next();
});

const Event: Model<IEvent> = mongoose.models.Event ?? mongoose.model<IEvent>("Event", eventSchema);

export default Event;