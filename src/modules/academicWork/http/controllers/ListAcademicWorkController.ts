import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAcademicWorkUseCase } from "../../useCases/ListAcademicWorkUseCase";

export class ListAcademicWorkController {
  async handle(req: Request, res: Response): Promise<Response> {
    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

    const organization_id = req.query.organization_id !== undefined ? Number(req.query.organization_id) : undefined;

    const academic_work_type_id = req.query.academic_work_type_id !== undefined ? Number(req.query.academic_work_type_id) : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListAcademicWorkUseCase);
    const result = await useCase.execute({
      title,
      organization_id,
      academic_work_type_id,
      page,
      take,
    });

    return res.json(result);
  }
}
