import React from 'react';

interface FileItem {
  id: number;
  title: string;
  updated_at: string;
}

interface FileListProps {
  files: FileItem[];
  selectedFileId?: number;
  onSelectFile: (file: FileItem) => void;
}

function FileList({ files, selectedFileId, onSelectFile }: FileListProps) {
  return (
    <div className="space-y-2">
      {files.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No files yet</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            onClick={() => onSelectFile(file)}
            className={`p-3 rounded cursor-pointer transition-colors ${
              selectedFileId === file.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <div className={`font-semibold truncate ${selectedFileId === file.id ? 'text-white' : ''}`}>
              {file.title}
            </div>
            <div className={`text-xs ${selectedFileId === file.id ? 'text-gray-200' : 'text-gray-500'}`}>
              {new Date(file.updated_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FileList;