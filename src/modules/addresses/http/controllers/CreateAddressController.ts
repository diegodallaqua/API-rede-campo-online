import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAddressUseCase } from "../../useCases/CreateAddressUseCase";

export class CreateAddressController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateAddressUseCase);
    const address = await useCase.execute(req.body);
    return res.status(201).json(address);
  }
}
