const mongoose = require("mongoose");

// sub schema to store the preferences for each user
const UserPreferencesSchema = new mongoose.Schema(
  {
    keyword: {
      type: [String],
      default: [],
    },
    language: {
      type: [String],
      default: ["eng"],
      validate: {
        validator: function (arr) {
          const allowed = ["eng", "hin", "kan", "spa", "ita", "deu", "zho"];
          return (
            Array.isArray(arr) &&
            arr.length > 0 &&
            arr.every((v) => allowed.includes(v))
          );
        },
        message:
          "language must contain one or more of: eng, hin, kan, spa, ita, deu, zho",
      },
    },
    // articles with following keywords will be ignored
    ignoreKeyword: {
      type: [String],
      default: [],
    },

    // date - date article was published
    // sourceImportance - based on rankings of various sources
    // socialScore - based on activity of article on social media
    articlesSortBy: {
      type: String,
      enum: ["date", "sourceImportance", "socialScore"],
      default: "sourceImportance",
    },
    articlesSortByAsc: {
      type: Boolean,
      default: false,
    },

    articlesCount: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
    },
    // maximum age of the articles
    maxDaysBack: {
      type: Number,
      default: 1,
      max: 30,
    },
    isDuplicateFilter: {
      type: String,
      enum: ["skipDuplicates", "keepOnlyDuplicates", "keepAll"],
      default: "skipDuplicates",
    },
    minSentiment: {
      type: Number,
      min: -1,
      max: 1,
      default: -1,
    },
    maxSentiment: {
      type: Number,
      min: -1,
      max: 1,
      default: 1,
    },
  },
  { _id: false, strict: "throw" }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
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
      type: UserPreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
