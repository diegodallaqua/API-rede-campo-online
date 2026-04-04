export interface ICreateProjectHasResearchAreaDTO {
  project_id: number;
  research_area_id: number;
}

export type ProjectResearchAreaItem = {
  id: number;
  name: string;
};

export interface IProjectHasResearchAreasRepository {
  createMany(data: ICreateProjectHasResearchAreaDTO[]): Promise<void>;
  deleteByProjectId(project_id: number): Promise<void>;
  findResearchAreaIdsByProjectId(project_id: number): Promise<number[]>;
  findResearchAreasByProjectId(project_id: number): Promise<ProjectResearchAreaItem[]>;
}