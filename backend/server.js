const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const postRouter = require("./routes/posts");

const app = express();
const port = 8080;

app.use(cors({
	origin: ["http://localhost:4200", "https://amdiazz.com", "amdiazz.netlify.app"],
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["X-API-KEY", "Content-Type"],
}));


app.use(express.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use('/api', postRouter);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});