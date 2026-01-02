import app from "./app";
import { config } from "dotenv";

config();

const PORT: number = parseInt(process.env.PORT || "3300", 10);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
