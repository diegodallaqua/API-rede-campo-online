export interface ICreateNewsHasResearchAreaDTO {
  research_area_id: number;
  news_id: number;
}

export type NewsResearchAreaItem = {
  id: number;
  name: string;
};

export interface INewsHasResearchAreasRepository {
  createMany(data: ICreateNewsHasResearchAreaDTO[]): Promise<void>;
  deleteByNewsId(news_id: number): Promise<void>;
  findResearchAreaIdsByNewsId(news_id: number): Promise<number[]>;
  findResearchAreasByNewsId(news_id: number): Promise<NewsResearchAreaItem[]>;
}