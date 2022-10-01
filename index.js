const express = require("express");
const userRoutes = require("./routes/userRoutes");
require("./config/db");

const app = express();

app.use(express.json());
app.use("/app", userRoutes);

app.listen(4000, () => {
  console.log("Server is listening at 4000");
});
