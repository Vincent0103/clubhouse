import "dotenv/config";
import express from "express";
import path from "path";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import indexController from "./controllers/indexController";
import db from "./db/queries";
import registerRouter from "./routes/registerRouter";
import loginRouter from "./routes/login/loginRouter";
import createPostRouter from "./routes/createPostRouter";
import logoutRouter from "./routes/logoutRouter";
import deleteMessageRouter from "./routes/deleteMessageRouter";

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({ secret: "chainsawman", resave: false, saveUninitialized: false }),
);
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      const errorMsg = "Invalid username or password.";

      if (!user) {
        return done(null, false, { message: errorMsg });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: errorMsg });
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", indexController.indexGet);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/create-post", createPostRouter);
app.use("/logout", logoutRouter);
app.use("/delete-message", deleteMessageRouter);

// 404 Handler - Place before error handler
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong';
  
  // Don't expose error details in production
  const error = process.env.NODE_ENV === 'development' ? err : null;
  
  res.status(statusCode).render('error', {
    statusCode,
    message,
    error,
    user: req.user || null
  });
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Express app listening at port ${PORT}`);
});
