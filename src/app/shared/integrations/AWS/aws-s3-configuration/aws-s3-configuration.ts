import { IStorageConfig } from "../../../interfaces/cloud/storage-config.interface";
import { S3 } from "@aws-sdk/client-s3"

export class AwsS3Configuration implements IStorageConfig {
    
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    endpoint: string;

    private s3Client: S3;

    constructor(region: string, accessKeyId: string, secretAccessKey: string, bucketName: string, endpoint: string) {
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.bucketName = bucketName;
        this.endpoint = endpoint;
        this.s3Client = new S3({region: this.region, credentials: {accessKeyId: this.accessKeyId, secretAccessKey: this.secretAccessKey}});
    }

    getS3Client(): S3 {
        return this.s3Client;
    }

}