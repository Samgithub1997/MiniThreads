import express from "express";
import { authRouter } from "./routes/auth.routes";
import { allUsersRouter } from "./routes/all-users.routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", async (req, res, next) => {
    return res.status(200).json({
      ok: true,
    });
  });

  app.use("/v1/auth", authRouter);
  app.use("/all-users", allUsersRouter);

  return app;
}
