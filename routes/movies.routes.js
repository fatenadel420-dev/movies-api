import  express  from "express";
export const  moviesRouter = express.Router();
import { Movie } from "../models/movie.model.js";
import { checkAuth } from "../middlewares/check-auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createMovieSchema } from "../validation-schemas/movie.schema.js";
import { updateMovieSchema } from "../validation-schemas/movie.schema.js";
import { validateObjectId } from "../middlewares/validate-object-id.middleware.js"; 
import { upload } from "../middlewares/upload.middleware.js";




moviesRouter.get("/", async (req, res, next) => {
  try {
    const { search, actor } = req.query;

    const filter = {
      title: { $regex: search || "", $options: "i" },
    };

    if (actor) {
      filter.actors = actor;
    }

    const movies = await Movie.find(filter).populate("actors");

    res.json({
      data: movies,
    });
  } catch (error) {
    next(error);
  }
});


moviesRouter.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("actors")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username image",
        },
      });

    if (!movie) {
      return res.status(404).json({
        error: "Movie not found",
      });
    }

    res.json({
      data: movie,
    });
  } catch (error) {
    next(error);
  }
});


moviesRouter.post("/",checkAuth,upload.single("image"),(req, res, next) => {
    if (req.file) {
      req.body.image = req.file.filename;
      }
    next();
  },
  validateBody(createMovieSchema),async (req, res, next) => {
    try {
      const movie = await Movie.create(req.body);

      res.status(201).json({
        message: "Movie created successfully",
        data: movie,
      });
    } catch (error) {
      next(error);
    }
  }
);


moviesRouter.patch("/:id",checkAuth,validateObjectId("id"),upload.single("image"),
  (req, res, next) => {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    next();
  },
  validateBody(updateMovieSchema),
  async (req, res, next) => {
    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      res.json({
        message: "Movie updated successfully",
        data: movie,
      });
    } catch (error) {
      next(error);
    }
  }
);


moviesRouter.delete(
  "/:id",
  checkAuth,
  validateObjectId("id"),
  async (req, res, next) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      res.json({
        message: "Movie deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);