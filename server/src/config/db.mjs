import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function main() {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  await mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.iz1hytg.mongodb.net/social-media`
  );
}

main()
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => console.log(err));
