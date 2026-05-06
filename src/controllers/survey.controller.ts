import { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

import { createSurveySchema } from "../validators/survey.validator.js";

export const createSurvey = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      createSurveySchema.parse(req.body);

    const survey = await prisma.survey.create({
      data: validatedData,
    });

    return res.status(201).json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSurveys = async (
  req: Request,
  res: Response
) => {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: surveys,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSurveyById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const survey = await prisma.survey.findUnique({
      where: {
        id,
      },
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    return res.json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateSurvey = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const validatedData =
      createSurveySchema.parse(req.body);

    const survey = await prisma.survey.update({
      where: {
        id,
      },
      data: validatedData,
    });

    return res.json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSurvey = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await prisma.survey.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message: "Survey deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

