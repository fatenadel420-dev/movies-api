import mongoose from "mongoose";
import crypto from "node:crypto";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});


sessionSchema.statics.createSession = async function (userId) {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const session = await this.create({
    sessionId,
    user: userId,
  });

  return session;
};


sessionSchema.statics.validateSession = async function (sessionId) {
  return this.findOne({
    sessionId,
    expiresAt: { $gt: new Date() },
  }).populate("user");
};


export const Session = mongoose.model("Session", sessionSchema);
