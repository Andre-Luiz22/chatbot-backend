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
  console.log(req.body);
  const agent = new WebhookClient({ req, res });
  function displayCursos(agent: WebhookClient) {
    agent.add("FOI");
  }
  let intentMap = new Map();
  intentMap.set("conhecerCursos - yes", displayCursos);
  agent.handleRequest(intentMap)

  res.status(200).json(req.body);
});
