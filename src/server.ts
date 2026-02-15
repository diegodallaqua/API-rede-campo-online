import { app } from "./shared/infra/http/app";
import { AppDataSource } from "./shared/infra/database/data-source";

async function bootstrap() {
  await AppDataSource.initialize();

  const port = Number(process.env.PORT ?? 3333);
  app.listen(port, () => {
    console.log(`[api] running on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("[api] failed to start", err);
  process.exit(1);
});
