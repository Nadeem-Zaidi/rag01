

export interface IChat{
    generate_store_embeddings(directory:string):Promise<void>;
    ask_question(question:string):Promise<string>
}