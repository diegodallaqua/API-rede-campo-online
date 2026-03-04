import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProjectMediaUseCase } from "../../useCases/ListProjectMediaUseCase";

export class ListProjectMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const pageRaw = req.query.page as any;
    const takeRaw = req.query.take as any;
    const projectIdRaw = req.query.project_id as any;

    const page = Number(pageRaw ?? 1);
    const take = Number(takeRaw ?? 10);

    const project_id_num = projectIdRaw !== undefined ? Number(projectIdRaw) : undefined;
    const project_id =
      project_id_num !== undefined && Number.isFinite(project_id_num) && project_id_num > 0
        ? project_id_num
        : undefined;

    const useCase = container.resolve(ListProjectMediaUseCase);

    const result = await useCase.execute({
      search,
      page,
      take,
      project_id,
    });

    return res.json(result);
  }
}