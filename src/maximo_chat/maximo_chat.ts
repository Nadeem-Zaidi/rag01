import type { ILLMResponse } from "../interface/illmresponse.js";
import type { IVectorStore } from "../interface/ivectorstore.js";
import dotenv from "dotenv";
import { OpenAIClient } from "../llm/open_ai.js";
import { VectorStore } from "../vector_store/vector_store.js";
import { QDRantDb } from "../vector_db/qdrant_vectordb.js";
import { LLMResponse } from "../lm_response/llm_response.js";
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export class MaximoChat{
    llm_response:ILLMResponse;
    vector_store:IVectorStore
    constructor(llm_response:ILLMResponse,vector_store:IVectorStore){
        this.llm_response=llm_response;
        this.vector_store=vector_store
    }

    async generate_store_embeddings(directory:string){
        await this.vector_store.generate_and_save_embeddings_paragraph_wise(directory)
    }
    async ask_question(question:string){
        return await this.llm_response.generate_response(question)
    }
    
}

