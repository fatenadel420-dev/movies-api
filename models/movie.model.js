import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    genres: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },

    trailerLink: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    director: {
      type: String,
      required: true,
    },

    actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Actor",
    },
],


  },
  { timestamps: true }
);

movieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie",
});

movieSchema.set("toJSON", { virtuals: true });
movieSchema.set("toObject", { virtuals: true });

movieSchema.statics.searchMovies = function (search) {
  return this.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { director: { $regex: search, $options: "i" } },
    ],
  });
};


movieSchema.pre("findOneAndDelete", async function () {
  const movie = await this.model.findOne(this.getFilter());

  if (movie) {
    await mongoose.model("Review").deleteMany({
      movie: movie._id,
    });
  }
});

export const Movie = mongoose.model("Movie", movieSchema);
