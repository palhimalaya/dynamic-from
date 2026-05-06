import { Router } from "express";

import { createSurvey, deleteSurvey, getSurveyById, getSurveys, updateSurvey } from "../controllers/survey.controller.js";

const router = Router();

router.post("/", createSurvey);
router.get("/", getSurveys);
router.get("/:id", getSurveyById);
router.put("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);

export default router;