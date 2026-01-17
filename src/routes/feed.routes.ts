import { NextFunction, Request, Response, Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../middleware/errorMiddleware";
import { getFeedQuerySchema } from "../validations/feed.validation";
import { db } from "../db/client";
import { followsTable, postsTable, usersTable } from "../db";
import { and, desc, eq, lt } from "drizzle-orm";
import { decodeCursor, encodeCursor } from "../lib/encode-decode";

export const feedRouter = Router();

feedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new HttpError(401, "Invalid credentials", null);

    const parsedQuery = getFeedQuerySchema.safeParse(req.query);
    if (!parsedQuery.success)
      throw new HttpError(400, "Bad request", parsedQuery.error.flatten());

    const { limit = 10, cursor } = parsedQuery.data;

    const whereClauses = [eq(followsTable.followerId, userId)];

    if (cursor) {
      const cursorDate = new Date(decodeCursor(cursor));
      whereClauses.push(lt(postsTable.createdAt, cursorDate));
    }

    const rows = await db
      .select({
        id: postsTable.id,
        authorId: postsTable.authorId,
        authorUsername: usersTable.username,
        content: postsTable.content,
        isEdited: postsTable.isEdited,
        createdAt: postsTable.createdAt,
      })
      .from(postsTable)
      .innerJoin(followsTable, eq(postsTable.authorId, followsTable.followeeId))
      .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .where(and(...whereClauses))
      .orderBy(desc(postsTable.createdAt), desc(postsTable.id)) // stable ordering within same timestamp
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const feed = hasNext ? rows.slice(0, limit) : rows;

    const last = feed[feed.length - 1];
    const nextCursor = hasNext && last ? encodeCursor(last.createdAt) : null;

    return res.status(200).json({
      data: feed,
      meta: { cursor: nextCursor },
    });
  })
);
