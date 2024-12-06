import { useState } from 'react';
import { Folder, Image, Trash2, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { imagekitService } from '../../../lib/services/imagekit';

interface FileInfo {
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  isFolder: boolean;
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  onClose?: () => void;
  isModal?: boolean;
  currentPath?: string;
}

export default function MediaLibrary({ onSelect, onClose, isModal = true, currentPath = '/' }: MediaLibraryProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState(currentPath);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleUpload = (url: string) => {
    const fileName = url.split('/').pop() || 'uploaded-file';
    const fileType = fileName.split('.').pop()?.toLowerCase() || '';
    
    const newFile: FileInfo = {
      name: fileName,
      url,
      type: fileType,
      size: 0,
      createdAt: new Date().toISOString(),
      isFolder: false
    };

    setFiles(prev => [...prev, newFile]);
    setUploading(false);
    setSelectedFile(url);
    
    if (onSelect) {
      onSelect(url);
    }
  };

  const handleFileSelect = (file: FileInfo) => {
    if (file.isFolder) {
      setCurrentFolder(file.url);
    } else {
      setSelectedFile(file.url);
      if (onSelect) {
        onSelect(file.url);
      }
    }
  };

  const handleDelete = async (file: FileInfo) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // For now, we'll just remove it from the UI
      setFiles(prev => prev.filter(f => f.url !== file.url));
      if (selectedFile === file.url) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderFileGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <div
          key={file.url}
          onClick={() => handleFileSelect(file)}
          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
            selectedFile === file.url ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          {file.isFolder ? (
            <div className="p-4 bg-gray-50 flex items-center justify-center aspect-square">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
          ) : (
            <>
              <div className="aspect-square bg-gray-100">
                {file.type.startsWith('image/') || file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file);
                }}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <p className="text-xs truncate">{file.name}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFileList = () => (
    <div className="divide-y">
      {files.map((file) => (
        <div
          key={file.url}
          onClick={() => handleFileSelect(file)}
          className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
            selectedFile === file.url ? 'bg-blue-50' : ''
          }`}
        >
          {file.isFolder ? (
            <Folder className="w-5 h-5 text-gray-400 mr-2" />
          ) : file.type.startsWith('image/') || file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-5 h-5 object-cover mr-2"
            />
          ) : (
            <Image className="w-5 h-5 text-gray-400 mr-2" />
          )}
          <span className="flex-1 truncate">{file.name}</span>
          {!file.isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(file);
              }}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={isModal ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4' : ''}>
      <div className={`bg-white rounded-lg shadow-xl ${isModal ? 'w-full max-w-4xl' : 'w-full'}`}>
        {isModal && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Media Library</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-gray-100' : ''}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-gray-100' : ''}`}
              >
                List
              </button>
            </div>
            <button
              onClick={() => setUploading(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload
            </button>
          </div>

          {uploading && (
            <div className="mb-4">
              <ImageUpload
                onUpload={handleUpload}
                onError={(error) => console.error(error)}
                folder={currentFolder}
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              {view === 'grid' ? renderFileGrid() : renderFileList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 