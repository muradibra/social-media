import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import express from "express";
import cors from "cors";
import "./config/db.mjs";
import "./config/auth-strategy.mjs";
import { createServer } from "http";
import { initializeSocket } from "./socket/index.mjs";

import authRoutes from "./routes/auth.mjs";
import postRoutes from "./routes/post.mjs";
import commentRoutes from "./routes/comment.mjs";
import userRoutes from "./routes/user.mjs";
import friendShipRoutes from "./routes/friendship.mjs";
import conversationRoutes from "./routes/conversation.mjs";

const app = express();
app.set('trust proxy', 1);
const server = createServer(app);
initializeSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: 'none',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

import Message from "./mongoose/schemas/message.mjs";

app.use("/public", express.static("public"));
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/invite", friendShipRoutes);
app.use("/user", userRoutes);
app.use('/conversation', conversationRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
