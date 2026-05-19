import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAddressesUseCase } from "../../useCases/ListAddressesUseCase";

export class ListAddressesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const city_id = req.query.city_id !== undefined ? Number(req.query.city_id) : undefined;

    const useCase = container.resolve(ListAddressesUseCase);
    const result = await useCase.execute({ search, page, take, city_id });

    return res.json(result);
  }
}
