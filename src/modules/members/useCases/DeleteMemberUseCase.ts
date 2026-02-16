import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IMemberRepository } from "../repositories/IMemberRepository";

@injectable()
export class DeleteMemberUseCase {
  constructor(
    @inject("MemberRepository")
    private memberRepository: IMemberRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.memberRepository.existsById(id);
    if (!exists) throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
    await this.memberRepository.delete(id);
  }
}
