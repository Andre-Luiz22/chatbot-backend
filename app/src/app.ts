import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { WebhookClient, Card } from "dialogflow-fulfillment";
dotenv.config();

export const app = express();

const bullet = String.fromCharCode(0x2022);

const options: cors.CorsOptions = {
  origin: "*",
  methods: "GET, POST",
};

app.use(cors(options));
app.use(express.json());
app.use(morgan("dev"));

app.post("/", (req: Request, res: Response) => {
  const cursos = {
    tecnologia: `Em tecnologia, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Desenvolvimento de Sistemas.\nPosso te dar mais detalhes sobre um curso, é só me dizer qual!`,
    gestao: `Em gestão, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Administração; \n Recursos Humanos; \n Segurança do Trabalho.\nPosso te dar mais detalhes sobre um curso, é só me dizer qual!`,
    saude: `Em saúde, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Enfermagem; \n${bullet} Radiologia; \n${bullet} Estética;\nPosso te dar mais detalhes sobre um curso, é só me dizer qual!`,
  };

  const cursosInfo = {
    ads: {
      title: "Técnico em Desenvolvimento de Sistemas",
      info: `\nCarga horária: 1200 horas, equivalentes a 2 anos de aulas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 8, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Os módulos são: \n${bullet} Tecnologia da informação; \n${bullet} Programação de Sistemas; \n${bullet} Análise de Sitemas; \n${bullet} Desenvolvimento de Sistemas para celulares; \n${bullet} Programação Front-end; \n${bullet} Programação back-end; \n${bullet} Administração de Redes; \n${bullet} Qualidade de Software.`,
    },

    adm: {
      title: "Técnico em Administração",
      info: `\nCarga horária: 1050 horas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 5, totalizando 27 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Os módulos são: \n${bullet} Instrumentos de Gestão; \n${bullet} Logística; \n${bullet} Marketing e Vendas; \n${bullet} Finanças; \n${bullet}  Recursos Humanos; \n${bullet} Análise de Acidentes de Trabalho; \n${bullet} Gestão em Meio Ambiente; \n${bullet} Ações para Segurança do Trabalho.`,
    },

    rh: {
      title: "Técnico em Recursos Humanos",
      info: `\nCarga horária: 800 horas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 5, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Os módulos são: \n${bullet} Gestão e Tecnologias; \n${bullet} Recursos Humanos; \n${bullet} Treinamento e Desenvolvimento de Pessoas; \n${bullet} Estratégia Organizacional; \n${bullet} Recrutamento e Seleção de Pessoas;`,
    },

    seg: {
      title: "Técnico em Segurança do Trabalho",
      info: `\nCarga horária: 1200 horas, equivalentes a 2 anos de aulas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 8, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Os módulos são: \n${bullet} Segurança do Trabalho; \n${bullet} Riscos Ocupacionais; \n${bullet} Proteção Contra Incêndio; \n${bullet} Gestão e Tecnologias; \n${bullet} Legislação em Segurança do Trabalho; \n${bullet} Análise de Acidentes de Trabalho; \n${bullet} Gestão em Meio Ambiente; \n${bullet} Ações para Segurança do Trabalho.`,
    },

    enf: {
      title: "Técnico em Enfermagem",
      info: `\nCarga horária: 1680 horas, equivalentes a 2 anos de aulas (480 correspondem a estágio obrigatório). \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 8, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Os módulos são: \n${bullet} Enfermagem na atenção à saúde do adulto; \n${bullet} Enfermagem na atenção domiciliar; \n${bullet} Enfermagem na clínica cirúrgica; \n${bullet} Enfermagem na saúde coletiva; \n${bullet} Enfermagem na saúde da mulher do homem, da criança e do adolescente; \n${bullet} Assistência ao paciente crítico adulto; \n${bullet} Assistência ao paciente crítico neonatal e pediátrico; \n${bullet} Enfermagem na qualidade e segurança do paciente.`,
    },
    est: {
      title: "Técnico em Estética",
      info: `\nCarga horária: 1200 horas, equivalentes a 2 anos de aulas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 8, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Ainda não consigo te mostrar os módulos de radiologia. Isso será resolvido em breve.`,
    },

    radio: {
      title: "Técnico em Radiologia",
      info: `\nCarga horária: 1200 horas, equivalentes a 2 anos de aulas. \n\nModalidade: 20% online e 80% presencial. \n\nQuantidade de módulos: 8, totalizando 16 disciplinas. \n\nValor da mensalidade: R$XXX,XX`,
      modulos: `Ainda não consigo te mostrar os módulos de radiologia. Isso será resolvido em breve.`,
    },
  };

  console.log(req.body);
  const agent = new WebhookClient({ request: req, response: res });

  function displayCursosDireta(agent: WebhookClient) {
    const areasCursos = agent.parameters["areas-cursos"];
    agent.add(cursos[areasCursos]);
  }

  function displayCursos(agent: WebhookClient) {
    const query = agent.query;
    const areasCursos = agent.parameters["areas-cursos"];

    if (!areasCursos) {
      agent.add("Qual delas?");
    } else if (areasCursos) {
      agent.add(cursos[areasCursos]);
    }
  }

  function displayCursoInfo(agent: WebhookClient) {
    const curso = agent.parameters["cursos"];

    if (!curso) {
      agent.add("Me diga sobre qual curso você deseja mais informações");
    } else {
      agent.add(
        new Card({
          title: cursosInfo[curso]["title"],
          text: cursosInfo[curso]["info"],
          buttonText: "Ver módulos",
          buttonUrl: `quero ver os modulos do curso de ${curso}`,
        })
      );
    }
  }

  function displayModulos(agent: WebhookClient) {
    const curso = agent.parameters["cursos"];
    agent.add(cursosInfo[curso]["modulos"]);
  }

  let intentMap = new Map();
  intentMap.set("conhecerCursos - yes", displayCursos);
  intentMap.set("conhecerCursosInfoDireta", displayCursosDireta);
  intentMap.set("cursoInfo", displayCursoInfo);
  intentMap.set("verModulos", displayModulos);
  agent.handleRequest(intentMap);
});
