import { container } from "tsyringe";
import { IMemberRepository } from "../repositories/IMemberRepository";
import { MemberRepository } from "../repositories/MemberRepository";

container.registerSingleton<IMemberRepository>("MemberRepository", MemberRepository);
