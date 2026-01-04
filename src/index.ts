// import { OpenAIClient } from "./llm/open_ai.js";
// import { LLMResponse } from "./lm_response/llm_response.js";
// import { MaximoChat } from "./maximo_chat/maximo_chat.js";
// import { QDRantDb } from "./vector_db/qdrant_vectordb.js";
// import { VectorStore } from "./vector_store/vector_store.js";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const llm_client=new OpenAIClient(OPENAI_API_KEY!)
// const vector_db_client=new QDRantDb("first_rag",1536)
// const vector_store=new VectorStore(llm_client,vector_db_client)
// const llm_response=new LLMResponse(llm_client,vector_db_client)
// const maximo_chat=new MaximoChat(llm_response,vector_store)

// console.log(maximo_chat.ask_question("what is clearance in ibm maximo"))