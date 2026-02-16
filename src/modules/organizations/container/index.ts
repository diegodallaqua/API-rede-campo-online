import { container } from "tsyringe";
import { IOrganizationRepository } from "../repositories/IOrganizationRepository";
import { OrganizationRepository } from "../repositories/OrganizationRepository";

container.registerSingleton<IOrganizationRepository>(
  "OrganizationRepository",
  OrganizationRepository
);
