import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { WebhookClient } from "dialogflow-fulfillment";
dotenv.config();

export const app = express();

const options: cors.CorsOptions = {
  origin: "*",
  methods: "GET, POST",
};

app.use(cors(options));
app.use(express.json());
app.use(morgan("dev"));

app.post("/", (req: Request, res: Response) => {
  const cursos = {
    tecnologia : "teste tecnologia",
    gestao: "teste gestão",
    saude: "teste saude"
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
  let intentMap = new Map();
  intentMap.set("conhecerCursos - yes", displayCursos);
  intentMap.set("conhecerCursosInfoDireta", displayCursosDireta);
  agent.handleRequest(intentMap);
});
