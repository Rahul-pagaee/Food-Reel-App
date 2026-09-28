require("dotenv").config();
const app = require("./src/app.js");
const connectDb = require("./src/db/db.js")


app.listen(3000, () => {
    connectDb()
  console.log("Server was running on port http://localhost:3000");
});
