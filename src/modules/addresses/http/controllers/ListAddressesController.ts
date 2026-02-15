import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAddressesUseCase } from "../../useCases/ListAddressesUseCase";

export class ListAddressesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const city_id = typeof req.query.city_id === "string" ? Number(req.query.city_id) : undefined;

    const useCase = container.resolve(ListAddressesUseCase);
    const result = await useCase.execute({ search, page, take, city_id });

    return res.json(result);
  }
}
