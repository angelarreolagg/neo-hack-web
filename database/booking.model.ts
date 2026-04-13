import mongoose, { Schema, type Document, type Model } from "mongoose";
import Event from "./event.model";

/** Mongoose document interface for Booking */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// Email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pre-save hook: validates email format and verifies the referenced event exists.
 */
bookingSchema.pre("save", async function () {
  // Validate email format
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format");
  }

  // Verify the event exists in the database
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist");
  }
});

const Booking: Model<IBooking> = mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;