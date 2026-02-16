import { container } from "tsyringe";
import { IMemberRoleRepository } from "../repositories/IMemberRoleRepository";
import { MemberRoleRepository } from "../repositories/MemberRoleRepository";

container.registerSingleton<IMemberRoleRepository>(
  "MemberRoleRepository",
  MemberRoleRepository
);
