
export interface IVectorDB {
  upsert(
    id: string,
    vector: number[],
    payload: Record<string, any>
  ): Promise<void>;

  upsertMany(
    ids: string[],
    vectors: number[][],
    payloads: Array<Record<string, any>>
  ): Promise<void>;

  search(
    vector: number[],
    limit?: number,
    withPayload?: boolean
  ): Promise<any>;

  delete(ids: string[]): Promise<void>;
}
