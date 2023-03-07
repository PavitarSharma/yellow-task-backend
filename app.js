import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import passport from "passport";
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passportConfig from "./config/passport.js";
import contactRoutes from "./routes/contact.routes.js";
import session from "express-session";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//applymiddlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
passportConfig(passport);
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is listening on live URL",
  });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);

app.use("*", (req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log("Datbase connected");
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
