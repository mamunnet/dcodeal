import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { storageService } from '../../../lib/services/storage';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelected?: (url: string) => void;
  onUpload?: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
}

export function ImageUpload({ 
  currentImage, 
  onImageSelected, 
  onUpload,
  folder = 'products',
  multiple = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show preview immediately
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    try {
      setUploading(true);
      
      if (multiple && onUpload) {
        // Handle multiple files
        const uploadPromises = Array.from(files).map(file => 
          storageService.uploadFile(file, { folder })
        );
        const results = await Promise.all(uploadPromises);
        const urls = results.map(result => result.url).filter(Boolean) as string[];
        onUpload(urls);
      } else if (onImageSelected) {
        // Handle single file
        const result = await storageService.uploadFile(files[0], { folder });
        if (result.url) {
          onImageSelected(result.url);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    if (onImageSelected) {
      onImageSelected('');
    }
  };

  const handleCancelUpload = () => {
    setUploading(false);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      {currentImage || previewImage ? (
        <div className="relative">
          <img
            src={currentImage || previewImage || ''}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={previewImage ? handleCancelUpload : handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex flex-col items-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span>Upload {multiple ? 'files' : 'a file'}</span>
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  accept="image/*"
                  multiple={multiple}
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {uploading && (
            <div className="mt-2 text-sm text-blue-500">Uploading...</div>
          )}
        </div>
      )}
    </div>
  );
} 