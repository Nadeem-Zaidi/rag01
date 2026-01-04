export interface ChatMessage{
    role:"system" | "user"|"assistant";
    content:string
}

export interface ILLM{
    chat(messages:Array<Record<string,any>>):Promise<string>;
    embedding(text:string):Promise<number[]>;
}