import { storage } from '../firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadMetadata
} from '@firebase/storage';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: {
    contentType: string;
    size: number;
    fullPath: string;
  };
}

interface UploadOptions {
  folder?: string;
  fileName?: string;
  contentType?: string;
}

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    try {
      const folder = options.folder || '';
      const fileName = options.fileName || `${Date.now()}-${file.name}`;
      const fullPath = folder ? `${folder}/${fileName}` : fileName;
      
      const fileRef = ref(storage, fullPath);
      const metadata: UploadMetadata = {
        contentType: options.contentType || file.type,
      };
      
      const result = await uploadBytes(fileRef, file, metadata);
      const downloadUrl = await getDownloadURL(result.ref);

      return {
        success: true,
        url: downloadUrl,
        metadata: {
          contentType: result.metadata.contentType || file.type,
          size: result.metadata.size,
          fullPath: result.metadata.fullPath,
        },
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  getFileUrl(path: string): Promise<string> {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  }
}

export const storageService = StorageService.getInstance(); 