import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { PublicationHasResearchArea } from "../entities/PublicationHasResearchArea";
import {
  ICreatePublicationHasResearchAreaDTO,
  IPublicationHasResearchAreasRepository,
  PublicationResearchAreaItem,
} from "./IPublicationHasResearchAreaRepository";

export class PublicationHasResearchAreasRepository
  implements IPublicationHasResearchAreasRepository
{
  private ormRepo: Repository<PublicationHasResearchArea>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(PublicationHasResearchArea);
  }

  async createMany(
    data: ICreatePublicationHasResearchAreaDTO[]
  ): Promise<void> {
    if (!data.length) return;

    const entities = this.ormRepo.create(data);
    await this.ormRepo.save(entities);
  }

  async deleteByPublicationId(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }

  async findResearchAreaIdsByPublicationId(
    publication_id: number
  ): Promise<number[]> {
    const rows = await this.ormRepo.find({
      where: { publication_id },
      select: {
        research_area_id: true,
      },
      order: {
        research_area_id: "ASC",
      },
    });

    return rows.map((row) => row.research_area_id);
  }

  async findResearchAreasByPublicationId(
    publication_id: number
  ): Promise<PublicationResearchAreaItem[]> {
    const rows = await this.ormRepo
      .createQueryBuilder("phra")
      .innerJoin("phra.researchArea", "ra")
      .select([
        "ra.id as id",
        "ra.name as name",
      ])
      .where("phra.publication_id = :publication_id", { publication_id })
      .orderBy("ra.name", "ASC")
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
    }));
  }
}