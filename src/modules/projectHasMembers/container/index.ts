import { container } from "tsyringe";
import { IProjectHasMembersRepository } from "../repositories/IProjectHasMembersRepository";
import { ProjectHasMembersRepository } from "../repositories/ProjectHasMembersRepository";

container.registerSingleton<IProjectHasMembersRepository>(
  "ProjectHasMembersRepository",
  ProjectHasMembersRepository
);