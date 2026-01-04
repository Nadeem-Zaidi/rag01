import OpenAI from "openai";
import type llm = require("../interface/llm");

export class OpenAIClient implements llm.ILLM{
    private client:OpenAI;
    private model:string;
    private embedding_model:string;


    constructor(api_key:string,model:string="gpt-4o-mini",embedding_model:string="text-embedding-3-small"){
       this.client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
       this.model=model;
       this.embedding_model=embedding_model 
    }
    async chat(messages: llm.ChatMessage[]): Promise<string> {
        const res=await this.client.chat.completions.create({
            model:this.model,
            messages
        })
        return res.choices[0]?.message.content ?? ""
    }
    async embedding(text: string): Promise<number[]> {
        const embedding=await this.client.embeddings.create({
            model:this.embedding_model,
            input:text
        })

        return embedding.data[0]?.embedding ?? []
    }

}