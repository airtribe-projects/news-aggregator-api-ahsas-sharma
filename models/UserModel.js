const mongoose = require("mongoose");

// sub schema to store the preferences for each user
const userPreferencesSchema = new mongoose.Schema(
  {
    topics: {
      type: [String],
      default: [],
    },

    language: {
      type: String,
      default: "eng",
    },

    region: {
      type: String,
      default: null,
    },

    sortBy: {
      type: String,
      enum: ["date", "relevance"],
      default: "date",
    },

    articlesPerPage: {
      type: Number,
      default: 10,
      min: 1,
      max: 50,
    },

    excludeDuplicates: {
      type: Boolean,
      default: true,
    },

    sentiment: {
      type: String,
      enum: ["any", "positive", "neutral", "negative"],
      default: "any",
    },

    blockedSources: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
