import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { NewsHasResearchArea } from "../entities/NewsHasResearchArea";
import {
  ICreateNewsHasResearchAreaDTO,
  INewsHasResearchAreasRepository,
  NewsResearchAreaItem,
} from "./INewsHasResearchAreaRepository";

export class NewsHasResearchAreasRepository
  implements INewsHasResearchAreasRepository
{
  private ormRepo: Repository<NewsHasResearchArea>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(NewsHasResearchArea);
  }

  async createMany(data: ICreateNewsHasResearchAreaDTO[]): Promise<void> {
    if (!data.length) return;

    const entities = this.ormRepo.create(data);
    await this.ormRepo.save(entities);
  }

  async deleteByNewsId(news_id: number): Promise<void> {
    await this.ormRepo.delete({ news_id });
  }

  async findResearchAreaIdsByNewsId(news_id: number): Promise<number[]> {
    const rows = await this.ormRepo.find({
      where: { news_id },
      select: {
        research_area_id: true,
      },
      order: {
        research_area_id: "ASC",
      },
    });

    return rows.map((row) => row.research_area_id);
  }

  async findResearchAreasByNewsId(news_id: number): Promise<NewsResearchAreaItem[]> {
    const rows = await this.ormRepo
      .createQueryBuilder("nhra")
      .innerJoin("nhra.researchArea", "ra")
      .select([
        "ra.id as id",
        "ra.name as name",
      ])
      .where("nhra.news_id = :news_id", { news_id })
      .orderBy("ra.name", "ASC")
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
    }));
  }
}