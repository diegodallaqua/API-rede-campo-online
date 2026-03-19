import { container } from "tsyringe";
import { IPublicationContributorRepository } from "../repositories/IPublicationContributorRepository";
import { PublicationContributorRepository } from "../repositories/PublicationContributorRepository";

container.registerSingleton<IPublicationContributorRepository>(
  "PublicationContributorRepository",
  PublicationContributorRepository
);