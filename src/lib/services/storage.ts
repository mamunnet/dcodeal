import { ref, uploadBytes, getDownloadURL, deleteObject } from '@firebase/storage';
import { storage } from '../firebase';

interface UploadOptions {
  folder: string;
}

interface UploadResponse {
  url: string;
}

class StorageService {
  async uploadFile(file: File, options: UploadOptions): Promise<UploadResponse> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${options.folder}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      return { url };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const storageService = new StorageService(); 