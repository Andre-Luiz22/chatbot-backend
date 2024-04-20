import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { WebhookClient } from "dialogflow-fulfillment";
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
    tecnologia : `Em tecnologia, as unidades de BH da Proz ofertam o curso técnico em Desenvolvimento de Sistemas`,
    gestao: `Em gestão, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Administração; \n Recursos Humanos; \n Segurança do Trabalho; \n Logística`,
    saude: `Em saúde, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Enfermagem; \n${bullet} Radiologia; \n${bullet} Estética;`
  }

  const cursosInfo = {
    "ads" : "O **Técnico em Desenvolviemnto de Sistemas** possui uma carga horária de XXXhoras, equivalentes a 2 anos de aulas 20% online e 80% presenciais, com 8 módulos, 16 disciplinas. Esses módulos são: Tecnologia da informação, Programação de Sistemas, Análise de Sitemas, Desenvolvimento de Sistemas para celulares, Programação Front-end, Programação back-end, Administração de Redes e Qualidade de Software."
  }

  console.log(req.body);
  const agent = new WebhookClient({ request: req, response: res });

  function displayCursosDireta( agent: WebhookClient) {
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

    if(!curso) {
      agent.add("Me diga sobre qual curso você deseja mais informações")
    } else {
      agent.add(cursosInfo[curso]);
    }
  }

  let intentMap = new Map();
  intentMap.set("conhecerCursos - yes", displayCursos);
  intentMap.set("conhecerCursosInfoDireta", displayCursosDireta);
  intentMap.set("cursosInfo", displayCursoInfo);
  agent.handleRequest(intentMap);
});