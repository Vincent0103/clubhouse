import "dotenv/config";
import express from "express";
import path from "path";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import indexController from "./controllers/indexController";
import db from "./db/queries";

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

app.get("/", indexController.homepageGet);
app.get("/register", indexController.registerGet);
app.post("/register", indexController.registerPost);
app.get("/login", indexController.loginGet);
app.post("/login", indexController.loginPost);
app.post("/login-club", indexController.loginClubPost);
app.get("/logout", indexController.logoutPost);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Express app listening at port ${PORT}`);
});
