import type { ILLMResponse } from "../interface/illmresponse.js";
import type { IVectorStore } from "../interface/ivectorstore.js";
import dotenv from "dotenv";
import type { S3_Client } from "../aws/s3_storage/s3_client.js";
import type { IChat } from "../interface/ichat.js";
dotenv.config();
export class MaximoChat implements IChat{
    llm_response:ILLMResponse;
    vector_store:IVectorStore;
    s3client?:S3_Client|null
    constructor(llm_response:ILLMResponse,vector_store:IVectorStore){
        this.llm_response=llm_response;
        this.vector_store=vector_store
    }

    async generate_store_embeddings(directory:string){
        await this.vector_store.generate_and_save_embeddings_paragraph_wise(directory)
    }
    async ask_question(question:string):Promise<string>{
        return await this.llm_response.generate_response(question)
    }
    async generate_store_embeddings_from_s3(){  
        await this.vector_store.generate_and_save_embeddings_paragraph_wise_from_s3()

    }
}

