import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
});

const SlideSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["content", "slider", "cards"],
    required: true,
  },

  content: String,

  slides: [SlideSchema],

  cards: [CardSchema],
});

const MinistrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    shortDesc: String,

    logo: String,

    coverImage: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    blocks: [BlockSchema],
  },
  { timestamps: true }
);

export const MinistryModel = mongoose.model(
  "Ministry",
  MinistrySchema
);