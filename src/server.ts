import * as dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import morgan from "morgan";
import cors from "cors";
import expressStatusMonitor from "express-status-monitor";
import { router } from "./routes";
import { Request, Response } from "express";
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(expressStatusMonitor());

app.use("/api", router);

app.get("", (request: Request, response: Response) => {
  response.send("Rethink Academy Portal API - Versão 01");
});

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(
    chalk.blueBright.bold(
      `
      Yep this is working 🍺 🎉 
      App listen on port: ${PORT} 🥷
      Env: ${NODE_ENV} 🦄
      `
    )
  );
});
