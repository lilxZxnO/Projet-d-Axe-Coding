import express from "express";
import cors from "cors";
import router from "./routes/start.js"; // Assurez-vous que le chemin est correct
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

app.use(
  cors({
    origin: "http://127.0.0.1:3000", // Spécifiez explicitement l'origine de votre frontend
  })
);

app.use(router);

const initializeApp = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

initializeApp();
