const express = require("express");
const app = express();
const session = require("express-session");
const { databaseConnection } = require("./db");
const clientRouter = require("./clientRoute");

// Establish database connection
databaseConnection();

app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(clientRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
