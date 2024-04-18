import express, { Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";

import morgan from "morgan";
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
  res.status(200).json(req.body);
});
