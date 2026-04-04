export interface ICreatePublicationHasResearchAreaDTO {
  publication_id: number;
  research_area_id: number;
}

export type PublicationResearchAreaItem = {
  id: number;
  name: string;
};

export interface IPublicationHasResearchAreasRepository {
  createMany(data: ICreatePublicationHasResearchAreaDTO[]): Promise<void>;
  deleteByPublicationId(publication_id: number): Promise<void>;
  findResearchAreaIdsByPublicationId(publication_id: number): Promise<number[]>;
  findResearchAreasByPublicationId(
    publication_id: number
  ): Promise<PublicationResearchAreaItem[]>;
}