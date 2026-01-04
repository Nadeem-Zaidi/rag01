import type { ILLMResponse } from "../interface/illmresponse.js";
import type { IVectorDB } from "../interface/ivectordb.js";
import type { ILLM } from "../interface/llm.js";

export class LLMResponse implements ILLMResponse {
  private client: ILLM;
  private vclient:IVectorDB;

  constructor(llmClient: ILLM, vectorDB: IVectorDB) {
    this.client = llmClient;
    this.vclient = vectorDB;
  }

  async client_response(
    question: string,
    context: string
  ): Promise<string> {
    const prompt = `
            You are a helpful assistant.
            Answer ONLY from the provided transcript context ,also provide some meaningful example if user asks for the provided context.
            If the context is insufficient, just say you don't know.

            ${context}

            Question: ${question}
`;

    const messages = [
      { role: "system", content: "Answer strictly from the provided context." },
      { role: "user", content: prompt },
    ];

    const response = await this.client.chat(messages);
    return response;
  }

  async generate_response(question: string): Promise<string> {
    const embedding = await this.client.embedding(question);
    const result = await this.vclient.search(embedding,10)
    const answer = await this.client_response(question, result);
    return answer
  }
}
