import { container } from "tsyringe";
import { IContributorRoleRepository } from "../repositories/IContributorRoleRepository";
import { ContributorRoleRepository } from "../repositories/ContributorRoleRepository";

container.registerSingleton<IContributorRoleRepository>(
  "ContributorRoleRepository",
  ContributorRoleRepository
);
