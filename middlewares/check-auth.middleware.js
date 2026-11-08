import { Session } from "../models/session.model.js";

export const checkAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.movie_session;

    if (!sessionId) {
      return res.status(401).json({
        error: "You must be logged in",
      });
    }

    const session = await Session.validateSession(sessionId);

    if (!session) {
      return res.status(401).json({
        error: "Invalid or expired session",
      });
    }

    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};