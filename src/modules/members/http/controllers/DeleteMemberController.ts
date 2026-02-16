import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteMemberUseCase } from "../../useCases/DeleteMemberUseCase";

export class DeleteMemberController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(DeleteMemberUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
