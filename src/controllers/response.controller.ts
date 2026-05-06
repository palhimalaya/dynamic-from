import { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

import { submitResponseSchema } from "../validators/response.validator.js";

export const submitResponse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const validatedData =
      submitResponseSchema.parse(req.body);

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

    const response =
      await prisma.surveyResponse.create({
        data: {
          surveyId: id,
          answers: validatedData.answers,
        },
      });

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};