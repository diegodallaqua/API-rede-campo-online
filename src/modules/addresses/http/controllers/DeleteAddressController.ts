import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteAddressUseCase } from "../../useCases/DeleteAddressUseCase";

export class DeleteAddressController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteAddressUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
