import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import surveyRoutes from "./routes/survey.routes";
import responseRoutes from "./routes/response.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Survey API Running",
  });
});

app.use("/api/surveys", surveyRoutes);
app.use("/api/surveys", responseRoutes);
app.use("/api/surveys", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});