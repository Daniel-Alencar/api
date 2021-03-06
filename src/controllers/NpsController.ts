import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute (request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRespository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRespository.find({
      survey_id: survey_id,
      value: Not(IsNull()),
    });
    const totalAnswers = surveysUsers.length;

    const detractores = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    )
    .length;

    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    )
    .length;

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    )
    .length;

    const calculate = Number(
      (((promoters - detractores) / (totalAnswers)) * 100).toFixed(2)
    );

    return response.json({
      detractores,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController }