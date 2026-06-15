import "dotenv/config";
import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";

const isProd = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3307),
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "db_rede_campo_online",

  // funciona em TS (dev) e em JS (build), sem depender de cwd
  entities: [
    path.resolve(__dirname, "..", "..", "..", "modules", "**", "entities", "*.{ts,js}")
  ],

  // se você usa migrations, deixe isso apontado
  migrations: [
    path.resolve(__dirname, "..", "typeorm", "migrations", "*.{ts,js}")
  ],

  // migrations > synchronize (evita surpresas)
  synchronize: false,

  logging: !isProd
});