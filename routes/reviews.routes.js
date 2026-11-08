import express from "express";
export const reviewsRouter = express.Router();
import { Review } from "../models/review.model.js";
import { checkAuth } from "../middlewares/check-auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { validateObjectId } from "../middlewares/validate-object-id.middleware.js";
import { createReviewSchema, updateReviewSchema,} from "../validation-schemas/review.schema.js";
import { Movie } from "../models/movie.model.js";




reviewsRouter.get("/my", checkAuth, async (req, res, next) => {
  try {
    const reviews = await Review.findByUser(req.user._id);

    res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
});


reviewsRouter.post( "/:movieId",checkAuth,validateObjectId("movieId"),validateBody(createReviewSchema),
  async (req, res, next) => {
    try {
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) {
    return res.status(404).json({
      error: "Movie not found",
    });
  }

  const review = await Review.create({
    number: req.body.number,
    comment: req.body.comment,
    movie: req.params.movieId,
    user: req.user._id,
  });   

  res.status(201).json({
  message: "Review created successfully",
  data: review,
});
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.patch("/:id",checkAuth,validateObjectId("id"),validateBody(updateReviewSchema),
  async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      if (!review.user.equals(req.user._id)) {
        return res.status(403).json({ error: "Not authorized" });
      }

      Object.assign(review, req.body);
      await review.save();

      res.json({
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.delete("/:id",checkAuth,validateObjectId("id"),async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      if (!review.user.equals(req.user._id)) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await review.deleteOne();

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);