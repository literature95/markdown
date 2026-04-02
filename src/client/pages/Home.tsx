import React, { useEffect, useState } from 'react';
import { getFiles, createFile, updateFile, deleteFile } from '../api/client';

interface File {
  id: number;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const handleCreate = async () => {
    try {
      await createFile(title, content);
      setTitle('');
      setContent('');
      setIsCreating(false);
      loadFiles();
    } catch (err) {
      console.error('Failed to create file:', err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;
    try {
      await updateFile(selectedFile.id, title, content);
      loadFiles();
    } catch (err) {
      console.error('Failed to update file:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteFile(id);
      if (selectedFile?.id === id) {
        setSelectedFile(null);
        setTitle('');
        setContent('');
      }
      loadFiles();
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  const selectFile = (file: File) => {
    setSelectedFile(file);
    setTitle(file.title);
    setContent(file.content || '');
    setIsCreating(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedFile(null);
            setTitle('');
            setContent('');
          }}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mb-4"
        >
          New File
        </button>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => selectFile(file)}
              className={`p-3 rounded cursor-pointer ${
                selectedFile?.id === file.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-300'
              }`}
            >
              <div className="font-semibold truncate">{file.title}</div>
              <div className={`text-xs ${selectedFile?.id === file.id ? 'text-gray-200' : 'text-gray-500'}`}>
                {new Date(file.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        {(selectedFile || isCreating) ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="File title"
              className="w-full text-2xl font-bold mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your markdown here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <div className="mt-4 flex gap-2">
              {isCreating ? (
                <button
                  onClick={handleCreate}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Create
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              )}
              {selectedFile && (
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              )}
              {(selectedFile || isCreating) && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setTitle('');
                    setContent('');
                    setIsCreating(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select or create a file to start editing
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;