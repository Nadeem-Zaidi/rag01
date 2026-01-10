import { CopyObjectCommand, DeleteBucketCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import type Stream from "node:stream";
import { paginateListObjectsV2 } from "@aws-sdk/client-s3";

export class S3_Client {
    private bucket: string;
    private prefix: string;
    private destinationPrefix: string | null = null;
    private s3Client: S3Client;
    constructor(bucket: string, prefix: string, destinationPrefix: string) {
        this.bucket = bucket;
        this.prefix = prefix;
        this.destinationPrefix = destinationPrefix
        this.s3Client = new S3Client({
            region: "ap-south-1",
        })
    }

    async list_files() {
        const files = [];

        const paginator = paginateListObjectsV2(
            { client: this.s3Client },
            { Bucket: this.bucket, Prefix: this.prefix }
        );

        for await (const page of paginator) {
            const txtFiles = page.Contents?.filter(
                obj => obj.Key?.endsWith(".txt")
            ) ?? [];

            files.push(...txtFiles);
        }

        return files;
    }

    private async stream_to_string(stream: Stream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on("data", chunk => chunks.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
            stream.on("error", reject)
        })

    }

    async read_file(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        })
        const response = await this.s3Client.send(command)
        return await this.stream_to_string(response.Body as any)
    }

    private split_into_paragraph(text: string): string[] {
        return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    }
    async *read_paragraphs(): AsyncGenerator<string> {
        const files = await this.list_files();

        for (const file of files) {
            if (!file.Key) continue;

            const content = await this.read_file(file.Key);
            const paragraphs = this.split_into_paragraph(content);

            for (const paragraph of paragraphs) {
                yield paragraph;
            }
        }

        if (this.destinationPrefix) await this.moveFolder(this.prefix, this.destinationPrefix)


    }

    async moveFile(source_key: string, destination_key: string | null) {
        const copyCommand = new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: `${this.bucket}/${source_key}`,
            Key: `processed/${source_key}`
        });
        await this.s3Client.send(copyCommand)

        const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: source_key
        })

        await this.s3Client.send(deleteCommand)

    }

    async moveFolder(sourcePrefix: string, destinationPrefix: string) {
        const listObject = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: sourcePrefix,
        });

        const list = await this.s3Client.send(listObject);
        if (!list.Contents) return;

        for (const obj of list.Contents) {
            if (!obj.Key || obj.Key.endsWith("/")) continue;

            const newKey = obj.Key.replace(
                sourcePrefix,
                destinationPrefix
            );

            await this.s3Client.send(
                new CopyObjectCommand({
                    Bucket: this.bucket,
                    CopySource: `${this.bucket}/${obj.Key}`,
                    Key: newKey,
                })
            );

            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: obj.Key,
                })
            );
        }
    }

}
