export interface ILLMResponse{
    client_response(question:string,context:string):Promise<string>
    generate_response(question:string):Promise<string>

}