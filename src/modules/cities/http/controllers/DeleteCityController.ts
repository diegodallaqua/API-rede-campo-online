import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCityUseCase } from "../../useCases/DeleteCityUseCase";

export class DeleteCityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteCityUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
