import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import connectDbMongo from "./database";
import routes from "./routes";
import { config } from './config';


const app = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", routes());

app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}/`));

connectDbMongo();
