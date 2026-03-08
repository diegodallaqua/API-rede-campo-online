import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import { AppError } from "../../../shared/errors/AppError";
import { IMemberRepository, IUpdateMemberDTO } from "../repositories/IMemberRepository";
import { IMemberRoleRepository } from "../../memberRoles/repositories/IMemberRoleRepository";
import { IOrganizationRepository } from "../../organizations/repositories/IOrganizationRepository";

@injectable()
export class UpdateMemberUseCase {
  constructor(
    @inject("MemberRepository")
    private memberRepository: IMemberRepository,

    @inject("MemberRoleRepository")
    private memberRoleRepository: IMemberRoleRepository,

    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute(data: IUpdateMemberDTO): Promise<void> {
    const exists = await this.memberRepository.existsById(data.id);
    if (!exists) throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");

    const role = await this.memberRoleRepository.findById(data.member_role_id);
    if (!role) throw new AppError("Member role not found", 404, "ROLE_NOT_FOUND");

    const org = await this.organizationRepository.findById(data.organization_id);
    if (!org) throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");

    const email = data.email.trim().toLowerCase();

    const emailOwner = await this.memberRepository.findByEmail(email);
    if (emailOwner && emailOwner.id !== data.id) {
      throw new AppError("Email already in use", 409, "EMAIL_CONFLICT");
    }

    const passwordHash =
      data.password && data.password.trim().length >= 8
        ? await hash(data.password.trim(), 10)
        : null;

    await this.memberRepository.update({
      ...data,
      name: data.name.trim(),
      email,
      description: data.description.trim(),
      lattes_url: data.lattes_url?.trim() ?? null,
      linked_in_url: data.linked_in_url?.trim() ?? null,
      profile_picture: data.profile_picture?.trim() ?? null,
      password: passwordHash,
    });
  }
}
