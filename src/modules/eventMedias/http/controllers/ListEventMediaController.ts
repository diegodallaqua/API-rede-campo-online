import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListEventMediaUseCase } from "../../useCases/ListEventMediaUseCase";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export class ListEventMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const event_id = toNumber(req.query.event_id);

    const useCase = container.resolve(ListEventMediaUseCase);
    const result = await useCase.execute({ search, page, take, event_id });

    return res.json(result);
  }
}