import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateMemberUseCase } from "../../useCases/UpdateMemberUseCase";

export class UpdateMemberController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateMemberUseCase);
    await useCase.execute({ id, ...req.body });

    return res.json({ message: "Member updated" });
  }
}
