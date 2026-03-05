import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListEventsUseCase } from "../../useCases/ListEventsUseCase";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export class ListEventsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page = toNumber(req.query.page) ?? 1;
    const take = toNumber(req.query.take) ?? 10;

    const project_id = toNumber(req.query.project_id);

    const useCase = container.resolve(ListEventsUseCase);
    const result = await useCase.execute({ search, page, take, project_id });

    return res.json(result);
  }
}