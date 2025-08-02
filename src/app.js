import "dotenv/config";
import express from "express";
import path from "path";
import indexController from "./controllers/indexController";

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.get("/", indexController.homepageGet);
app.get("/register", indexController.registerGet);
app.post("/register", indexController.registerPost);
app.get("/login", indexController.loginGet);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Express app listening at port ${PORT}`);
});
