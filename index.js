require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { graphqlHTTP } = require('express-graphql')

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')



const app = express();

app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if(req.method === 'OPTIONS') {
    res.sendStatus(200)
  }
  next();
});

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err) {
    if(!err.originalError) {
      return err
    }

    const {data} = err.originalError
    const {code} = err.originalError || 500
    const {message} = err || 'An Error Occurred'
    return {message: message, status: code, data: data}
  }
}))

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const {message, data} = error
    res.status(status).json({message: message, data: data})
})

mongoose
  .connect(process.env.MONGOPRODUCTION)
  .then((result) => {
    app.listen(5000, () => console.log("listening on 5000"));
  })
  .catch((err) => console.log("connecting to mongoDB Atlas failed", err));
