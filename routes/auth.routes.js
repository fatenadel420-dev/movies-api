
import express from "express";

import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";

import { validateBody } from "../middlewares/validate-body.middleware.js";
import { checkAuth } from "../middlewares/check-auth.middleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation-schemas/auth.schema.js";

import { upload } from "../middlewares/upload.middleware.js";

export const authRouter = express.Router();

// Create session cookie
const setSessionCookie = (res, sessionId) => {
  res.cookie("movie_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register
authRouter.post(
  "/register",
  upload.single("image"),
  validateBody(registerSchema),
  async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    return res.status(409).json({
      error: "Email already exists",
    });
  }

 const user = await User.create({
  username,
  email,
  password,
  image: req.file ? req.file.filename : "",
});

  res.status(201).json({
    message: "register successful, you can now login",
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Login
authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const session = await Session.createSession(user._id);

  setSessionCookie(res, session.sessionId);

  res.json({
    message: "login successful",
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});





authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    res.json({
      message: "OTP generated successfully",
      otp,
    });
  }
);



authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res) => {
    const {
      email,
      otp,
      new_password,
      new_password_confirmation,
    } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    user.password = new_password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    res.json({
      message: "password reset successful",
    });
  }
);

// Logout
authRouter.post("/logout", async (req, res) => {
  const sessionId = req.cookies?.movie_session;

  if (sessionId) {
    await Session.deleteOne({ sessionId });
  }

  res.clearCookie("movie_session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    message: "logout successful",
  });
});

// Get current logged-in user
authRouter.get("/me", checkAuth, (req, res) => {
  res.json({
    data: {
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        image: req.user.image,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    },
  });
});
