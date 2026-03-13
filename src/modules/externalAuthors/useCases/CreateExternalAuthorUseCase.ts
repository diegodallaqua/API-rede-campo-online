import { inject, injectable } from "tsyringe";
import { ExternalAuthor } from "../entities/ExternalAuthor";
import { IExternalAuthorRepository } from "../repositories/IExternalAuthorRepository";

type IRequest = {
  name: string;
  email?: string | null;
  orcid?: string | null;
};

@injectable()
export class CreateExternalAuthorUseCase {
  constructor(
    @inject("ExternalAuthorRepository")
    private externalAuthorRepository: IExternalAuthorRepository
  ) {}

  async execute({
    name,
    email,
    orcid,
  }: IRequest): Promise<ExternalAuthor> {
    return this.externalAuthorRepository.create({
      name: name.trim(),
      email: email?.trim() || null,
      orcid: orcid?.trim() || null,
    });
  }
}