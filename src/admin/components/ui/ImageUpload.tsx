import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { storageService } from '../../../lib/services/storage';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
}

export default function ImageUpload({ onUpload, folder = 'products', multiple = true }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      const uploadPromises = Array.from(files).map(file => 
        storageService.uploadFile(file, {
          folder,
          fileName: `${Date.now()}-${file.name}`
        })
      );

      const results = await Promise.all(uploadPromises);
      const urls = results
        .filter(result => result.success && result.url)
        .map(result => result.url!);

      if (urls.length > 0) {
        onUpload(urls);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Upload className={`h-8 w-8 ${loading ? 'text-gray-400' : 'text-blue-500'}`} />
        <span className="mt-2 text-sm font-medium text-gray-900">
          {loading ? 'Uploading...' : 'Click to upload images'}
        </span>
        <span className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </span>
      </button>
    </div>
  );
} 