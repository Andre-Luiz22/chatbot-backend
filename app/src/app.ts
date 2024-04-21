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
    tecnologia : `Em tecnologia, as unidades de BH da Proz ofertam o curso técnico em Desenvolvimento de Sistemas`,
    gestao: `Em gestão, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Administração; \n Recursos Humanos; \n Segurança do Trabalho; \n Logística`,
    saude: `Em saúde, as unidades de BH da Proz ofertam os seguintes cursos técnicos: \n${bullet} Enfermagem; \n${bullet} Radiologia; \n${bullet} Estética;`
  }

  const cursosInfo = {
    "ads" : "O Técnico em Desenvolviemnto de Sistemas possui uma carga horária de 1200 horas, equivalentes a 2 anos de aulas 20% online e 80% presenciais, com 8 módulos, 16 disciplinas. \nEsses módulos são: \n${bullet} Tecnologia da informação; \n${bullet} Programação de Sistemas; \n${bullet} Análise de Sitemas; \n${bullet} Desenvolvimento de Sistemas para celulares; \n${bullet} Programação Front-end; \n${bullet} Programação back-end; \n${bullet} Administração de Redes; \n${bullet} Qualidade de Software.",

    "enf" : "O Técnico em Enfermagem possui uma carga horária de 1680 horas, equivalentes a 2 anos de aulas 20% online e 80% presenciais, com 8 módulos, 16 disciplinas. Dessa carga horária, 480 horas correspondem a estágios obrigatórios para a formação do aluno.\nOs módulos presentes são: \nEnfermagem na atenção à saúde do adulto, Enfermagem na atenção domiciliar, Enfermagem na clínica cirúrgica, Enfermagem na saúde coletiva, Enfermagem na saúde da mulher, do homem, da criança e do adolescente, Assistência ao paciente crítico adulto, Assistência ao paciente crítico neonatal e pediátrico e Enfermagem na qualidade e segurança do paciente."

    
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

    agent.add(new Card({
      title : "Titulo teste",
      text : "lorem lorem lorem lorem lorem lorem lorem",
      subtitle: "teste",
      buttonText : "voltar para menu",
      buttonUrl : "menu"
    }));
  }

  let intentMap = new Map();
  intentMap.set("conhecerCursos - yes", displayCursos);
  intentMap.set("conhecerCursosInfoDireta", displayCursosDireta);
  intentMap.set("cursoInfo", displayCursoInfo);
  agent.handleRequest(intentMap);
});