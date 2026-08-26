import { Project } from "../../projects/entities/Project";
import { PublicationProject } from "../repositories/IPublicationRepository";

export function toPublicationProject(
  project?: Project | null
): PublicationProject | null {
  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: Boolean(project.status),
    begin_date: project.begin_date,
    end_date: project.end_date ?? null,
    projectType: {
      id: project.projectType?.id ?? project.project_type_id,
      name: project.projectType?.name ?? "",
    },
  };
}
