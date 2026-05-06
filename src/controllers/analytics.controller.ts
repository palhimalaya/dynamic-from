import { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

export const getSurveyAnalytics = async (
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

    const responses =
      await prisma.surveyResponse.findMany({
        where: {
          surveyId: id,
        },
      });

    const analytics: any = {
      totalResponses: responses.length,
      questions: [],
    };

    const questions =
      (survey.schema as any).questions;

    for (const question of questions) {
      const answers = responses.map(
        (response: any) =>
          response.answers[question.id]
      );

      if (
        question.type === "radio" ||
        question.type === "checkbox"
      ) {
        const counts: Record<string, number> =
          {};

        for (const answer of answers) {
          if (Array.isArray(answer)) {
            for (const item of answer) {
              counts[item] =
                (counts[item] || 0) + 1;
            }
          } else if (answer) {
            counts[answer] =
              (counts[answer] || 0) + 1;
          }
        }

        analytics.questions.push({
          questionId: question.id,
          title: question.title,
          type: question.type,
          counts,
        });
      }

      if (question.type === "rating") {
        const validAnswers = answers.filter(
          Boolean
        );

        const average =
          validAnswers.reduce(
            (sum: number, value: number) =>
              sum + value,
            0
          ) / validAnswers.length;

        analytics.questions.push({
          questionId: question.id,
          title: question.title,
          type: question.type,
          average,
        });
      }

      if (question.type === "text") {
        analytics.questions.push({
          questionId: question.id,
          title: question.title,
          type: question.type,
          responses: answers.filter(Boolean),
        });
      }
    }

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};