import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { ExternalAuthor } from "../entities/ExternalAuthor";
import { IExternalAuthorRepository } from "../repositories/IExternalAuthorRepository";

type IRequest = {
  id: number;
  name: string;
  email?: string | null;
  orcid?: string | null;
};

@injectable()
export class UpdateExternalAuthorUseCase {
  constructor(
    @inject("ExternalAuthorRepository")
    private externalAuthorRepository: IExternalAuthorRepository
  ) {}

  async execute({
    id,
    name,
    email,
    orcid,
  }: IRequest): Promise<ExternalAuthor> {
    const externalAuthor = await this.externalAuthorRepository.findById(id);

    if (!externalAuthor) {
      throw new AppError("External author not found", 404, "EXTERNAL_AUTHOR_NOT_FOUND");
    }

    return this.externalAuthorRepository.update({
      id,
      name: name.trim(),
      email: email?.trim() || null,
      orcid: orcid?.trim() || null,
    });
  }
}