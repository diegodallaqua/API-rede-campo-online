import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import { AppError } from "../../../shared/errors/AppError";
import { IMemberRepository, ICreateMemberDTO } from "../repositories/IMemberRepository";
import { IMemberRoleRepository } from "../../memberRoles/repositories/IMemberRoleRepository";
import { IOrganizationRepository } from "../../organizations/repositories/IOrganizationRepository";

@injectable()
export class CreateMemberUseCase {
  constructor(
    @inject("MemberRepository")
    private memberRepository: IMemberRepository,

    @inject("MemberRoleRepository")
    private memberRoleRepository: IMemberRoleRepository,

    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute(data: ICreateMemberDTO): Promise<void> {
    const role = await this.memberRoleRepository.findById(data.member_role_id);
    if (!role) throw new AppError("Member role not found", 404, "ROLE_NOT_FOUND");

    const org = await this.organizationRepository.findById(data.organization_id);
    if (!org) throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    const emailExists = await this.memberRepository.findByEmail(email);
    if (emailExists) throw new AppError("Email already in use", 409, "EMAIL_CONFLICT");

    const passwordHash =
      data.password && data.password.trim().length >= 8
        ? await hash(data.password.trim(), 10)
        : null;

    await this.memberRepository.create({
      ...data,
      name,
      email,
      description: data.description.trim(),
      lattes_url: data.lattes_url?.trim() ?? null,
      linked_in_url: data.linked_in_url?.trim() ?? null,
      profile_picture: data.profile_picture?.trim() ?? null,
      password: passwordHash,
    });
  }
}
