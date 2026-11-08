import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    birthdate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


actorSchema.virtual("movies", {
  ref: "Movie",
  localField: "_id",
  foreignField: "actors",
});

actorSchema.set("toJSON", { virtuals: true });
actorSchema.set("toObject", { virtuals: true });

actorSchema.statics.searchByName = function (search) {
  return this.find({
    name: { $regex: search, $options: "i" },
  });
};

export const Actor = mongoose.model("Actor", actorSchema);
