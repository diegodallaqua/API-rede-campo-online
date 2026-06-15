import { MigrationInterface, QueryRunner } from "typeorm";

const RESEARCH_AREAS: string[] = [
  // Agronomia / Produção Vegetal
  "Manejo Integrado de Pragas (MIP)",
  "Manejo Integrado de Doenças (MID)",
  "Agricultura de Precisão",
  "Fertilidade do Solo",
  "Nutrição de Plantas",
  "Irrigação e Drenagem",
  "Agricultura Digital",
  "Melhoramento Genético Vegetal",
  "Biotecnologia Vegetal",
  "Produção de Sementes",
  "Sistemas Integrados Lavoura-Pecuária-Floresta (ILPF)",
  "Agricultura Regenerativa",
  "Agricultura Orgânica",
  "Fitopatologia",
  "Plantas Daninhas",
  "Conservação do Solo",
  "Agrometeorologia",
  "Agroecologia",
  "Fisiologia Vegetal",
  "Ecofisiologia de Culturas",
  "Fenologia de Plantas",
  "Manejo de Culturas Anuais",
  "Manejo de Culturas Perenes",
  "Olericultura",
  "Fruticultura",
  "Silvicultura",
  "Citricultura",
  "Cafeicultura",
  "Cana-de-Açúcar",
  "Sojicultura",
  "Rizicultura",
  "Cotonicultura",
  "Heveicultura",

  // Solo e Água
  "Física do Solo",
  "Química do Solo",
  "Biologia do Solo",
  "Microbiologia do Solo",
  "Matéria Orgânica do Solo",
  "Pedologia",
  "Mapeamento de Solos",
  "Qualidade da Água para Irrigação",
  "Hidrologia Agrícola",
  "Erosão e Sedimentologia",

  // Sanidade Vegetal e Animal
  "Virologia Vegetal",
  "Bacteriologia Vegetal",
  "Nematologia",
  "Acarologia Agrícola",
  "Controle Biológico",
  "Resistência de Plantas a Doenças",
  "Epidemiologia de Doenças de Plantas",
  "Toxicologia de Pesticidas",
  "Medicina Veterinária Preventiva",
  "Parasitologia Animal",
  "Imunologia Animal",
  "Virologia Animal",

  // Pecuária e Zootecnia
  "Nutrição Animal",
  "Melhoramento Genético Animal",
  "Reprodução Animal",
  "Bem-Estar Animal",
  "Produção de Bovinos de Corte",
  "Produção de Bovinos Leiteiros",
  "Avicultura",
  "Suinocultura",
  "Piscicultura",
  "Apicultura",
  "Ovinocultura",
  "Caprinocultura",
  "Pecuária de Precisão",
  "Sistemas de Pastejo",
  "Sanidade Animal",
  "Comportamento Animal",
  "Produção de Forragens",
  "Emissões de Gases na Pecuária",
  "Pecuária Sustentável",
  "Rastreabilidade Animal",
  "Cunicultura",
  "Carcinicultura",
  "Ranicultura",
  "Produção de Equinos",
  "Produção de Búfalos",
  "Etnozootecnia",
  "Genômica Animal",
  "Qualidade de Carne e Derivados",
  "Qualidade do Leite",
  "Bioclimatologia Animal",
  "Manejo de Resíduos Pecuários",

  // Tecnologia e Digital
  "Inteligência Artificial",
  "Aprendizado de Máquina",
  "Deep Learning",
  "Visão Computacional",
  "Ciência de Dados",
  "Big Data",
  "Internet das Coisas (IoT)",
  "Computação em Nuvem",
  "Sistemas Embarcados",
  "Robótica",
  "Desenvolvimento Mobile",
  "Desenvolvimento Web",
  "Segurança da Informação",
  "Blockchain",
  "Sistemas de Apoio à Decisão",
  "Computação Aplicada ao Agronegócio",
  "Gêmeos Digitais",
  "Automação Industrial",
  "Edge Computing",
  "Engenharia de Software",
  "Sensoriamento Remoto",
  "Geoprocessamento",
  "Sistemas de Informação Geográfica (SIG)",
  "Veículos Aéreos Não Tripulados (Drones)",
  "Modelagem e Simulação Agrícola",
  "Processamento de Imagens Agrícolas",
  "Redes de Sensores Sem Fio",
  "Infraestrutura de Dados Espaciais",
  "Plataformas AgriTech",
  "Processamento de Linguagem Natural (PLN)",
  "Computação Quântica Aplicada",

  // Meio Ambiente e Sustentabilidade
  "Ecologia de Ecossistemas",
  "Ecologia de Paisagens",
  "Conservação da Biodiversidade",
  "Recuperação de Áreas Degradadas",
  "Ecologia de Insetos",
  "Ecologia Florestal",
  "Ecologia Aquática",
  "Serviços Ecossistêmicos",
  "Monitoramento Ambiental",
  "Gestão de Recursos Hídricos",
  "Mudanças Climáticas",
  "Ecologia Microbiana",
  "Corredores Ecológicos",
  "Conservação de Polinizadores",
  "Economia Circular",
  "Bioeconomia",
  "Energias Renováveis",
  "Produção Sustentável de Alimentos",
  "Certificação Ambiental",
  "Pegada de Carbono",
  "Pegada Hídrica",
  "Sequestro de Carbono",
  "Sustentabilidade em Cadeias Produtivas",
  "Desenvolvimento Rural Sustentável",
  "Agroflorestas",
  "Agricultura de Baixo Carbono",
  "Agricultura Familiar",
  "Climatologia Agrícola",
  "Adaptação às Mudanças Climáticas",
  "Mitigação de Mudanças Climáticas",
  "Análise de Ciclo de Vida (ACV)",
  "Gestão de Resíduos Agroindustriais",
  "Bioindicadores Ambientais",
  "Pagamento por Serviços Ambientais (PSA)",
  "Restauração Ecológica",
  "Limnologia",
  "Etnobotânica",
  "Etnobiologia",

  // Econômico-Social e Cadeia Produtiva
  "Economia Agrícola",
  "Mercados e Comercialização Agropecuária",
  "Cadeia de Suprimentos no Agronegócio",
  "Logística Rural",
  "Extensão Rural",
  "Sociologia Rural",
  "Políticas Agrícolas",
  "Crédito e Financiamento Rural",
  "Gestão de Propriedades Rurais",
  "Cooperativismo Agropecuário",
  "Agroindustrialização",
  "Segurança Alimentar e Nutricional",
  "Rastreabilidade de Alimentos",
  "Comércio Internacional do Agronegócio",

  // Biotecnologia e Genômica
  "Transgenia e Edição Gênica (CRISPR)",
  "Bioinformática",
  "Genômica e Transcriptômica de Plantas",
  "Proteômica e Metabolômica",
  "Epigenética Vegetal e Animal",
  "Microbiotas e Metagenômica",
  "Biopesticidas e Biofertilizantes",
  "Inoculantes Microbianos",
];

const MEMBER_DESCRIPTION =
  "Professora na Universidade Tecnológica Federal do Paraná (UTFPR), Campus Santa Helena/PR. " +
  "Professora permanente do Programa de Pós-Graduação em Agroecossistemas (PPGSIS). " +
  "Professora Permanente no Programa de Pós-Graduação em Desenvolvimento rural Sustentável (PPGDRS/UNIOESTE). " +
  "Pós-Doutora em Desenvolvimento Rural (CNPq e CAPES/FAPERGS). " +
  "Mestra e Doutora em Desenvolvimento Rural pelo Programa de Pós-Graduação em Desenvolvimento Rural (PGDR), " +
  "da Universidade Federal do Rio Grande do Sul (UFRGS), com período de sanduíche no Centro de Cooperação " +
  "Internacional em Pesquisa Agronômica para o Desenvolvimento (Cirad). Bacharel em Zootecnia pela " +
  "Universidade Federal de Santa Maria (UFSM), Campus Palmeira das Missões. Tem experiência na área de " +
  "Sociologia Rural, com ênfase em Desenvolvimento Rural, atuando principalmente com as seguintes temáticas " +
  "de pesquisa: mercados agropecuários, convenções, sociologia da alimentação, vulnerabilidade, sucessão rural, " +
  "todos relacionados à pecuária e agricultura familiar. Integrante do Grupo de Estudos e Pesquisas em " +
  "Agricultura, Alimentação e Desenvolvimento (GEPAD). Integrante da Rede LiFLoD (Livestock Farming and " +
  "Local Development Network). Líder do grupo Rede Campo (Rede de Pesquisa, Inovação e Extensão em " +
  "Desenvolvimento Rural)";

interface IbgeEstado {
  id: number;
  sigla: string;
  nome: string;
}

interface IbgeMunicipio {
  id: number;
  nome: string;
  microrregiao?: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  } | null;
  "regiao-imediata"?: {
    "regiao-intermediaria": {
      UF: {
        sigla: string;
      };
    };
  } | null;
}

export class SeedInitialData20260615000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // States
    const estadosRes = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );
    const estados: IbgeEstado[] = await estadosRes.json();

    const stateIdByUf: Record<string, number> = {};
    for (const estado of estados) {
      const result = await queryRunner.query(
        "INSERT INTO `state` (`name`) VALUES (?)",
        [estado.nome]
      );
      stateIdByUf[estado.sigla] = result.insertId;
    }

    // Cities
    const municipiosRes = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );
    const municipios: IbgeMunicipio[] = await municipiosRes.json();

    const cityRows: [number, string][] = municipios.map((m) => {
      const sigla =
        m.microrregiao?.mesorregiao.UF.sigla ??
        m["regiao-imediata"]?.["regiao-intermediaria"].UF.sigla;
      return [stateIdByUf[sigla as string], m.nome];
    });

    const chunkSize = 500;
    for (let i = 0; i < cityRows.length; i += chunkSize) {
      const chunk = cityRows.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => "(?, ?)").join(", ");
      const values = chunk.flat();
      await queryRunner.query(
        `INSERT INTO \`city\` (\`state_id\`, \`name\`) VALUES ${placeholders}`,
        values
      );
    }

    // Member roles
    await queryRunner.query(
      "INSERT INTO `memberrole` (`id`, `name`) VALUES (1, 'Fundador'), (2, 'Pesquisador'), (3, 'Desenvolvedor')"
    );

    // Address
    await queryRunner.query(
      "INSERT INTO `address` (`id`, `city_id`, `street`, `neighborhood`, `number`, `cep`, `complement`) VALUES (1, 1, 'Rua Cerejeira', 'São Luiz', 661, '85892000', NULL)"
    );

    // Organization
    await queryRunner.query(
      "INSERT INTO `organization` (`id`, `address_id`, `name`, `logo`) VALUES (1, 1, 'UTFPR', '')"
    );

    // Project types
    await queryRunner.query(
      "INSERT INTO `projecttype` (`id`, `name`) VALUES (1, 'Projeto de Extensão'), (2, 'Projeto de Desenvolvimento Tecnológico e Inovação'), (3, 'Projeto de Pesquisa')"
    );

    // Research areas
    const researchAreaPlaceholders = RESEARCH_AREAS.map(() => "(?)").join(", ");
    await queryRunner.query(
      `INSERT INTO \`researcharea\` (\`name\`) VALUES ${researchAreaPlaceholders}`,
      RESEARCH_AREAS
    );

    // Member
    await queryRunner.query(
      "INSERT INTO `member` (`id`, `member_role_id`, `organization_id`, `name`, `email`, `description`, `lattes_url`, `linked_in_url`, `profile_picture`, `password`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        6,
        1,
        1,
        "Alessandra Matte",
        "amatte@utfpr.edu.br",
        MEMBER_DESCRIPTION,
        "http://lattes.cnpq.br/4891738079879327",
        null,
        "https://pub-06ce1715ceb246d8a6cc8501edb72f89.r2.dev/member/1/53107951-97d4-4ca7-b5ca-70078016a430-large.webp",
        "$2b$10$pA7uVbsXTvC.jSt6019OsOtJZtzOJRrPAWC4UBgqcIAdfHwG5wVBa",
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM `member` WHERE `id` = 6");
    await queryRunner.query("DELETE FROM `researcharea`");
    await queryRunner.query("DELETE FROM `projecttype` WHERE `id` IN (1, 2, 3)");
    await queryRunner.query("DELETE FROM `organization` WHERE `id` = 1");
    await queryRunner.query("DELETE FROM `address` WHERE `id` = 1");
    await queryRunner.query("DELETE FROM `memberrole` WHERE `id` IN (1, 2, 3)");
    await queryRunner.query("DELETE FROM `city`");
    await queryRunner.query("DELETE FROM `state`");
  }
}
