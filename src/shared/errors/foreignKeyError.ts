import { AppError } from "./AppError";

type Gender = "m" | "f";

interface TableLabel {
  singular: string;
  plural: string;
  gender: Gender;
}

/**
 * Nomes legíveis das tabelas, usados para montar as mensagens de erro
 * de chave estrangeira. Ao criar uma nova entidade, adicione-a aqui.
 */
const TABLE_LABELS: Record<string, TableLabel> = {
  academicwork: { singular: "trabalho acadêmico", plural: "trabalhos acadêmicos", gender: "m" },
  academicworktype: { singular: "tipo de trabalho acadêmico", plural: "tipos de trabalho acadêmico", gender: "m" },
  address: { singular: "endereço", plural: "endereços", gender: "m" },
  article: { singular: "artigo", plural: "artigos", gender: "m" },
  book: { singular: "livro", plural: "livros", gender: "m" },
  bookchapter: { singular: "capítulo de livro", plural: "capítulos de livro", gender: "m" },
  city: { singular: "cidade", plural: "cidades", gender: "f" },
  contributorrole: { singular: "papel de contribuidor", plural: "papéis de contribuidor", gender: "m" },
  event: { singular: "evento", plural: "eventos", gender: "m" },
  eventmedia: { singular: "mídia de evento", plural: "mídias de evento", gender: "f" },
  externalauthor: { singular: "autor externo", plural: "autores externos", gender: "m" },
  member: { singular: "membro", plural: "membros", gender: "m" },
  memberrole: { singular: "função de membro", plural: "funções de membro", gender: "f" },
  news: { singular: "notícia", plural: "notícias", gender: "f" },
  newshasresearcharea: { singular: "vínculo entre notícia e área de pesquisa", plural: "vínculos entre notícias e áreas de pesquisa", gender: "m" },
  newsmedia: { singular: "mídia de notícia", plural: "mídias de notícia", gender: "f" },
  organization: { singular: "organização", plural: "organizações", gender: "f" },
  project: { singular: "projeto", plural: "projetos", gender: "m" },
  projecthasmember: { singular: "participação de membro em projeto", plural: "participações de membros em projetos", gender: "f" },
  projecthasresearcharea: { singular: "vínculo entre projeto e área de pesquisa", plural: "vínculos entre projetos e áreas de pesquisa", gender: "m" },
  projectmedia: { singular: "mídia de projeto", plural: "mídias de projeto", gender: "f" },
  projecttype: { singular: "tipo de projeto", plural: "tipos de projeto", gender: "m" },
  publication: { singular: "publicação", plural: "publicações", gender: "f" },
  publicationcontributor: { singular: "contribuidor de publicação", plural: "contribuidores de publicação", gender: "m" },
  publicationhasresearcharea: { singular: "vínculo entre publicação e área de pesquisa", plural: "vínculos entre publicações e áreas de pesquisa", gender: "m" },
  researcharea: { singular: "área de pesquisa", plural: "áreas de pesquisa", gender: "f" },
  state: { singular: "estado", plural: "estados", gender: "m" },
  technicalreport: { singular: "relatório técnico", plural: "relatórios técnicos", gender: "m" },
};

// MySQL: "Cannot delete or update a parent row: a foreign key constraint fails"
const ER_ROW_IS_REFERENCED = 1217;
const ER_ROW_IS_REFERENCED_2 = 1451;

// Ex.: (`db`.`event`, CONSTRAINT `FK_events_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ...
const FK_DETAILS_REGEX =
  /`[^`]+`\.`([^`]+)`, CONSTRAINT `[^`]+` FOREIGN KEY \([^)]*\) REFERENCES `([^`]+)`/;

function getErrno(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;
  const e = err as { errno?: number; driverError?: { errno?: number } };
  return e.driverError?.errno ?? e.errno;
}

function buildMessage(childTable: string, parentTable: string): string | undefined {
  const parent = TABLE_LABELS[parentTable];
  const child = TABLE_LABELS[childTable];
  if (!parent || !child) return undefined;

  const p = parent.gender === "m"
    ? { este: "Este", excluido: "excluído", ele: "ele", o: "o" }
    : { este: "Esta", excluido: "excluída", ele: "ela", o: "a" };
  const c = child.gender === "m"
    ? { vinculados: "vinculados", esses: "esses" }
    : { vinculados: "vinculadas", esses: "essas" };

  return (
    `${p.este} ${parent.singular} não pode ser ${p.excluido} porque existem ` +
    `${child.plural} ${c.vinculados} a ${p.ele}. ` +
    `Exclua ou altere ${c.esses} ${child.plural} antes de excluir ${p.o} ${parent.singular}.`
  );
}

/**
 * Converte o erro do MySQL de "registro em uso" (FK) em um AppError 409
 * com mensagem explicando qual dependência impede a exclusão.
 * Retorna undefined se o erro não for desse tipo.
 */
export function toForeignKeyAppError(err: unknown): AppError | undefined {
  const errno = getErrno(err);
  if (errno !== ER_ROW_IS_REFERENCED_2 && errno !== ER_ROW_IS_REFERENCED) {
    return undefined;
  }

  const rawMessage = (err as Error).message ?? "";
  const match = FK_DETAILS_REGEX.exec(rawMessage);
  const message =
    (match && buildMessage(match[1], match[2])) ??
    "Este registro não pode ser excluído porque existem outros registros que dependem dele. " +
      "Exclua ou altere esses registros antes de tentar novamente.";

  return new AppError(message, 409, "RECORD_IN_USE");
}
