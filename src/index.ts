const app = require("./app");
const config = require("dotenv").config;

config();

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
