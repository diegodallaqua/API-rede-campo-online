import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  ICreatePublicationContributorDTO,
  IPublicationContributorRepository,
} from "../repositories/IPublicationContributorRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IExternalAuthorRepository } from "../../externalAuthors/repositories/IExternalAuthorRepository";
import { IContributorRoleRepository } from "../../contributorRoles/repositories/IContributorRoleRepository";

@injectable()
export class CreatePublicationContributorUseCase {
  constructor(
    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("MemberRepository")
    private memberRepository: IMemberRepository,

    @inject("ExternalAuthorRepository")
    private externalAuthorRepository: IExternalAuthorRepository,

    @inject("ContributorRoleRepository")
    private contributorRoleRepository: IContributorRoleRepository
  ) {}

  async execute(data: ICreatePublicationContributorDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const contributorRole = await this.contributorRoleRepository.findById(
      data.contributor_role_id
    );
    if (!contributorRole) {
      throw new AppError("Contributor role not found", 404, "CONTRIBUTOR_ROLE_NOT_FOUND");
    }

    const hasMember = !!data.member_id;
    const hasExternalAuthor = !!data.external_author_id;

    if ((hasMember && hasExternalAuthor) || (!hasMember && !hasExternalAuthor)) {
      throw new AppError(
        "Exactly one of member_id or external_author_id must be provided",
        400,
        "INVALID_CONTRIBUTOR_REFERENCE"
      );
    }

    if (hasMember) {
      const memberExists = await this.memberRepository.existsById(data.member_id as number);
      if (!memberExists) {
        throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
      }

      const memberConflict = await this.publicationContributorRepository.findMemberConflict(
        data.publication_id,
        data.member_id as number,
        data.contributor_role_id
      );

      if (memberConflict) {
        throw new AppError(
          "This member already has this contributor role in the publication",
          409,
          "MEMBER_CONTRIBUTOR_CONFLICT"
        );
      }
    }

    if (hasExternalAuthor) {
      const externalAuthor = await this.externalAuthorRepository.findById(
        data.external_author_id as number
      );
      if (!externalAuthor) {
        throw new AppError("External author not found", 404, "EXTERNAL_AUTHOR_NOT_FOUND");
      }

      const externalConflict =
        await this.publicationContributorRepository.findExternalAuthorConflict(
          data.publication_id,
          data.external_author_id as number,
          data.contributor_role_id
        );

      if (externalConflict) {
        throw new AppError(
          "This external author already has this contributor role in the publication",
          409,
          "EXTERNAL_AUTHOR_CONTRIBUTOR_CONFLICT"
        );
      }
    }

    const authorOrderExists = await this.publicationContributorRepository.existsById(
      data.publication_id,
      data.author_order
    );

    if (authorOrderExists) {
      throw new AppError(
        "author_order already exists for this publication",
        409,
        "AUTHOR_ORDER_CONFLICT"
      );
    }

    await this.publicationContributorRepository.create({
      publication_id: data.publication_id,
      member_id: data.member_id ?? null,
      external_author_id: data.external_author_id ?? null,
      contributor_role_id: data.contributor_role_id,
      author_order: data.author_order,
    });
  }
}