import mongoose from "mongoose";

const clubRegistrationSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: [true, "Please add a club name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    title: {
      type: String,
      required: [true, "Please add an event title"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["academic", "career", "music", "volunteer", "workshop"],
    },
    date: {
      type: String,
      required: [true, "Please add an event date"],
    },
    location: {
      type: String,
      required: [true, "Please add an event location"],
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Please add an event description"],
    },
  },
  {
    timestamps: true,
  }
);

const ClubRegistration = mongoose.model("ClubRegistration", clubRegistrationSchema);

export default ClubRegistration;
