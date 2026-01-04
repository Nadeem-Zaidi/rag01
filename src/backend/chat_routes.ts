import { Router, type NextFunction, type Request, type Response } from "express";
import { OpenAIClient } from "../llm/open_ai.js";
import { QDRantDb } from "../vector_db/qdrant_vectordb.js";
import { VectorStore } from "../vector_store/vector_store.js";
import { LLMResponse } from "../lm_response/llm_response.js";
import { MaximoChat } from "../maximo_chat/maximo_chat.js";
import { tryCatch } from "../helper/try_catch.js";
import { LLMForDetail } from "../lm_response/llm_response_detail.js";
import path from "path";


const router = Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const llm_client=new OpenAIClient(OPENAI_API_KEY!)
const vector_db_client=new QDRantDb("first_rag",1536)
const vector_store=new VectorStore(llm_client,vector_db_client)
const llm_response=new LLMResponse(llm_client,vector_db_client)
const llm_for_details=new LLMForDetail(llm_client)
const maximo_chat=new MaximoChat(llm_response,vector_store)

router.post("/", tryCatch(async (req:Request, res:Response,next:NextFunction) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required",
      });
    }
    const answer = await maximo_chat.ask_question(question)
    res.json({
      question,
      answer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}));

router.get("/detail",tryCatch(async (req:Request,res:Response,next:NextFunction)=>{
  
  await maximo_chat.generate_store_embeddings("./src/documents")
  res.json({"status":"done"})
}))



export default router;
