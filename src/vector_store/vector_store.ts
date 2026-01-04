import type { IVectorStore } from "../interface/ivectorstore.js";
import fs from "fs";
import path from "path";
import readline from "readline";
import type { ILLM } from "../interface/llm.js";
import type { IVectorDB } from "../interface/ivectordb.js";
import { randomUUID } from "crypto";

export class VectorStore implements IVectorStore{
    private llm_client:ILLM;
    private vector_client:IVectorDB;

    constructor(llm_client:ILLM,vector_client:IVectorDB){
        this.llm_client=llm_client;
        this.vector_client=vector_client;

    }
    async *read_files_paragraphs(directory_name: string): AsyncGenerator<string, void, unknown> {
        const files=await fs.promises.readdir(directory_name)
        for(const filename of files){
            if(!filename.endsWith(".txt")) continue;
            const filepath=path.join(directory_name,filename)
            console.log(filepath)
            const filestream=fs.createReadStream(filepath,{encoding:"utf-8"})
            const rl=readline.createInterface({
                input:filestream,
                crlfDelay: Infinity,
            })
            let buffer: string[] = [];
            for await (const line of rl) {
                if (line.trim()) {
                    buffer.push(line.trimEnd());
                } else {
                    if (buffer.length > 0) {
                    yield buffer.join(" ");
                    buffer = [];
                    }
                }
            }
            if (buffer.length > 0) {
                yield buffer.join(" ");
            }
        }

    }
    async *read_files_lines(directory_name: string): AsyncGenerator<string, void, unknown> {
        throw new Error("Method not implemented.");
    }
    generate_and_save_embeddings(directory_name: string, size: number, overlap: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async generate_and_save_embeddings_paragraph_wise(directory_name: string): Promise<void> {
        await this.vector_client.ensureCollection()
        for await (const chunk of this.read_files_paragraphs(directory_name)){
            const embedding=await this.llm_client.embedding(chunk)
            await this.vector_client.upsert(randomUUID(),embedding,{text:chunk})
        }
    }
  

} 