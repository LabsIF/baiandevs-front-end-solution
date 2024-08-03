export interface IStorageService {

    uploadFile(file: File, path: string): Promise<string>;
    downloadFile(path: string): Promise<File>;
    deleteFile(path: string): Promise<void>;
    listFiles(path: string): Promise<string[]>;
    getFileUrl(path: string): Promise<string>;
    
}