import type { ILLMResponse } from "../interface/illmresponse.js";
import type { ILLM } from "../interface/llm.js";


export class LLMForDetail implements ILLMResponse{
    private client: ILLM;
     
    
      constructor(llmClient: ILLM) {
        this.client = llmClient;
      }
    
    async client_response(question: string, context: string): Promise<string> {
        const prompt = `You are a helpful chat assistant
                        Answer in very details as if you are expert in that topic.
                        ${question}-->${context}
                        `
        const messages=[
            {role:"system",content:"Answer in more details"},
            {role:"user",content:prompt}
        ]

        const response=await this.client.chat(messages);
        return response
    }
    generate_response(question: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

} 