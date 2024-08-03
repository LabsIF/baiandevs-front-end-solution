import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { IStorageService } from '../../../interfaces/cloud/storage-service.interface';
import { AwsS3Configuration } from '../aws-s3-configuration/aws-s3-configuration';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service implements IStorageService {

  private s3Client: AwsS3Configuration;

  constructor() {

    this.s3Client = new AwsS3Configuration(
      environment.awsS3.region,
      environment.awsS3.accessKeyId,
      environment.awsS3.secretAccessKey,
      environment.awsS3.bucketName,
      environment.awsS3.endpoint
    );

  }

  async uploadFile(file: File, path: string): Promise<string>
   {

    return new Promise((resolve, reject) => {
        
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
  
          const params = {
            Bucket: this.s3Client.bucketName,
            Key: path,
            Body: reader.result,
            ContentType: file.type,
            ACL: 'public-read'
          };
  
          try {
            const data = this.s3Client.getS3Client().putObject(params as any);
            resolve(data as any);
          } catch (error) {
            reject(error);
          }
  
        };
  
      });
  }
  downloadFile(path: string): Promise<File> {
    throw new Error('Method not implemented.');
  }
  deleteFile(path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  listFiles(path: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  getFileUrl(path: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

}
