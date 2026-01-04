import { QdrantClient } from "@qdrant/js-client-rest";
import type { IVectorDB } from "../interface/ivectordb.js";

export class QDRantDb implements IVectorDB {
    private client: QdrantClient;
    private collection: string;
    private size: number;

    constructor(collection_name: string, size: number, url: string = "http://localhost:6333") {
        this.client = new QdrantClient({ url: url, checkCompatibility: false });
        this.collection = collection_name;
        this.size = size;

    }
    private async ensureCollection() {
        const exists = await this.client.collectionExists(this.collection);
        if (!exists.exists) {
            await this.client.createCollection(this.collection, {
                vectors: {
                    size: this.size,
                    distance: "Cosine",
                },
            });
        }

    }
    async upsert(id: string, vector: number[], payload: Record<string, any>): Promise<void> {
        await this.client.upsert(this.collection, {
            wait: true,
            points: [
                {
                    id,
                    vector,
                    payload,
                },
            ],
        });
    }
    upsertMany(ids: string[], vectors: number[][], payloads: Array<Record<string, any>>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async search(vector: number[], limit?: number, withPayload?: boolean): Promise<any> {
        const results = await this.client.query(
            this.collection, {
            query: vector,
            limit: limit ?? 10,
            with_payload: withPayload ?? true

        }
        )
        const context = results.points
            .map((point: any) => point.payload?.text)
            .filter(Boolean)
            .join("\n");

        return context

    }
    delete(ids: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

}