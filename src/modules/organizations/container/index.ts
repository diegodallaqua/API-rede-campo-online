import { container } from "tsyringe";
import { IOrganizationRepository } from "../repositories/IOrganizationRepository";
import { OrganizationRepository } from "../repositories/OrganizationsRepository";

container.registerSingleton<IOrganizationRepository>(
  "OrganizationRepository",
  OrganizationRepository
);
