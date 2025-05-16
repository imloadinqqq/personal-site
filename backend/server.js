const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const postRouter = require("./routes/posts");
const { connectDB } = require("./db");

const app = express();
const port = 8080;

app.use(cors({
	origin: "https://amdiazz.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.use("/api", postRouter);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB issue:", err);
    process.exit(1);
  });
