import express from "express";
import cors from "cors";
import chatRoutes from "./chat_routes.js";
import { globalErrorHandler } from "../helper/global_error.js";

export const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/chat", chatRoutes);

app.use(globalErrorHandler);



