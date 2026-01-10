import type { IVectorStore } from "../interface/ivectorstore.js";
import fs from "fs";
import path from "path";
import readline from "readline";
import type { ILLM } from "../interface/llm.js";
import type { IVectorDB } from "../interface/ivectordb.js";
import { randomUUID } from "crypto";
import type { S3_Client } from "../aws/s3_storage/s3_client.js";

export class VectorStore implements IVectorStore{
    private llm_client:ILLM;
    private vector_client:IVectorDB;
    private s3client:S3_Client | null;

    constructor(llm_client:ILLM,vector_client:IVectorDB,s3Client:S3_Client){
        this.llm_client=llm_client;
        this.vector_client=vector_client;
        this.s3client=s3Client 

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

    async generate_and_save_embeddings_paragraph_wise_from_s3():Promise<void>{
        await this.vector_client.ensureCollection()
        
        if(!this.s3client){
            throw new Error("Specify the s3 client")
        }
        for await(const chunk of this.s3client.read_paragraphs()){
            const embedding=await this.llm_client.embedding(chunk)
            await this.vector_client.upsert(randomUUID(),embedding,{text:chunk})
         
        }

    }
  

} 