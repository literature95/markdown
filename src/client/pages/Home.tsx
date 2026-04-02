import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getFiles, createFile, updateFile, deleteFile, createShare } from '../api/client';

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
  const [showPreview, setShowPreview] = useState(true);
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState('');

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
        setShareLink('');
      }
      loadFiles();
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  const handleShare = async () => {
    if (!selectedFile) return;

    try {
      setShareError('');
      const response = await createShare(selectedFile.id, 24);
      setShareLink(response.link);
    } catch (error: any) {
      console.error('Failed to create share link:', error);
      setShareError(error.response?.data?.error || 'Share failed');
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
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-lg ${!showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                编辑
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-4 py-2 rounded-lg ${showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                预览
              </button>
            </div>
            <div className={showPreview ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your markdown here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              {showPreview && (
                <div
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg overflow-auto bg-white"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content || '输入 Markdown 后实时预览') as string) }}
                />
              )}
            </div>
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
              {selectedFile && (
                <button
                  onClick={handleShare}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Create Share Link
                </button>
              )}
              {(selectedFile || isCreating) && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setTitle('');
                    setContent('');
                    setIsCreating(false);
                    setShareLink('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
            {shareError && (
              <div className="mt-3 text-red-600">{shareError}</div>
            )}
            {shareLink && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">Share link created:</p>
                <a href={shareLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {shareLink}
                </a>
              </div>
            )}
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