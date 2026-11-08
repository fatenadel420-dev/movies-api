import express from "express";
export const actorsRouter = express.Router();
import { Actor } from "../models/actor.model.js";
import { validateObjectId } from "../middlewares/validate-object-id.middleware.js";
import { checkAuth } from "../middlewares/check-auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import {  createActorSchema,updateActorSchema,} from "../validation-schemas/actor.schema.js";
import { upload } from "../middlewares/upload.middleware.js";
import { Movie } from "../models/movie.model.js";




actorsRouter.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;

    const actors = await Actor.find({
      name: { $regex: search || "", $options: "i" },
    });

    res.json({
      data: actors,
    });
  } catch (error) {
    next(error);
  }
});


actorsRouter.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const actor = await Actor.findById(req.params.id).populate("movies");

    if (!actor) {
      return res.status(404).json({
        error: "Actor not found",
      });
    }

    res.json({
      data: actor,
    });
  } catch (error) {
    next(error);
  }
});

actorsRouter.post(  "/",  checkAuth,upload.array("images", 5),(req, res, next) => {
    req.body.images = req.files?.map((file) => file.filename) || [];
    next();
  },
  validateBody(createActorSchema),
  async (req, res, next) => {
    try {
      const actor = await Actor.create(req.body);

      res.status(201).json({
        message: "Actor created successfully",
        data: actor,
      });
    } catch (error) {
      next(error);
    }
  }
);

actorsRouter.patch("/:id",checkAuth,validateObjectId("id"),upload.array("images", 5),
  (req, res, next) => {
    if (req.files?.length) {
      req.body.images = req.files.map((file) => file.filename);
    }
    next();
  },
  validateBody(updateActorSchema),
  async (req, res, next) => {
    try {
      const actor = await Actor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!actor) {
        return res.status(404).json({
          error: "Actor not found",
        });
      }

      res.json({
        message: "Actor updated successfully",
        data: actor,
      });
    } catch (error) {
      next(error);
    }
  }
);

actorsRouter.delete("/:id",checkAuth,validateObjectId("id"),async (req, res, next) => {
    try {
      const actor = await Actor.findByIdAndDelete(req.params.id);

      if (!actor) {
        return res.status(404).json({
          error: "Actor not found",
        });
      }

      await Movie.updateMany(
        { actors: actor._id },
        { $pull: { actors: actor._id } }
      );

      res.json({
        message: "Actor deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

