import app from "./app";
import mongoose from "mongoose";
import config from "./config/config";

// 1. Connect to database (optional)
const DB = config.mongoUri.replace("<password>", config.mongoPassword);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to database");
  });

// 2. Start the server on a particular port
app.listen(app.get("port"), () => {
  console.log(`App running on port ${app.get("port")}`);
});
