import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { AppError } from "../../../shared/errors/AppError";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { authConfig } from "../../../config/auth";

type IRequest = {
  email: string;
  password: string;
};

type IResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    member_role: { id: number; name: string };
    organization: { id: number; name: string; logo: string; address_id: number };
  };
};

@injectable()
export class AuthenticateMemberUseCase {
  constructor(
    @inject("MemberRepository")
    private memberRepository: IMemberRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    const member = await this.memberRepository.findByEmailWithPassword(normalizedEmail);

    if (!member || !member.password) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const ok = await compare(password, member.password);
    if (!ok) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = sign(
      {
        role_id: member.member_role.id,
        organization_id: member.organization.id,
      },
      authConfig.jwt.secret,
      {
        subject: String(member.id),
        expiresIn: authConfig.jwt.expiresIn,
      }
    );

    return {
      token,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        member_role: member.member_role,
        organization: member.organization,
      },
    };
  }
}
