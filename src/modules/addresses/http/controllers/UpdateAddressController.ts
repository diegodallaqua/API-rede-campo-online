import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAddressUseCase } from "../../useCases/UpdateAddressUseCase";

export class UpdateAddressController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateAddressUseCase);
    const address = await useCase.execute({
      id,
      ...req.body,
    });

    return res.json(address);
  }
}
