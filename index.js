require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const {message} = error
    res.status(status).json({message: message})
})

mongoose
  .connect(process.env.MONGOPRODUCTION)
  .then((result) => {
    app.listen(5000, () => console.log("listening on 5000"));
  })
  .catch((err) => console.log("connecting to mongoDB Atlas failed", err));
