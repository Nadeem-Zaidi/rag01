export interface IVectorStore {
  read_files_paragraphs(
    directory_name: string
  ): AsyncGenerator<string, void, unknown>;

  read_files_lines(
    directory_name: string
  ): AsyncGenerator<string, void, unknown>;

  generate_and_save_embeddings(
    directory_name: string,
    size: number,
    overlap: number
  ): Promise<void>;

  generate_and_save_embeddings_paragraph_wise(
    directory_name: string
  ): Promise<void>;

  generate_and_save_embeddings_paragraph_wise_from_s3():Promise<void>
}
