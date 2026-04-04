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
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      console.error('加载文件失败:', err);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await createFile(title, content);
      setTitle('');
      setContent('');
      setIsCreating(false);
      loadFiles();
    } catch (err) {
      console.error('创建文件失败:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile || !title.trim()) return;
    setIsSaving(true);
    try {
      await updateFile(selectedFile.id, title, content);
      loadFiles();
    } catch (err) {
      console.error('保存文件失败:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个文档吗？')) return;
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
      console.error('删除文件失败:', err);
    }
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    try {
      setShareError('');
      const response = await createShare(selectedFile.id, 24);
      setShareLink(response.link);
    } catch (error: any) {
      setShareError(error.response?.data?.error || '分享失败');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const selectFile = (file: File) => {
    setSelectedFile(file);
    setTitle(file.title);
    setContent(file.content || '');
    setIsCreating(false);
    setShareLink('');
    setShareError('');
  };

  const startNewFile = () => {
    setIsCreating(true);
    setSelectedFile(null);
    setTitle('');
    setContent('');
    setShareLink('');
    setShareError('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="pt-14 flex h-screen">
        <aside className="w-[280px] bg-white border-r border-[#d2d2d7]/50 flex flex-col">
          <div className="p-4 border-b border-[#d2d2d7]/30">
            <button
              onClick={startNewFile}
              className="w-full h-10 bg-[#0071e3] text-white text-[14px] font-medium rounded-lg hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建文档
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-3 px-2">
              <h3 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide">我的文档</h3>
            </div>
            <div className="space-y-1">
              {files.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-[#86868b]">暂无文档</p>
                  <p className="text-[12px] text-[#86868b]/70 mt-1">点击上方按钮创建</p>
                </div>
              ) : (
                files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => selectFile(file)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-150 group ${
                      selectedFile?.id === file.id 
                        ? 'bg-[#0071e3] text-white' 
                        : 'hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <div className={`font-medium text-[14px] truncate ${selectedFile?.id === file.id ? 'text-white' : 'text-[#1d1d1f]'}`}>
                      {file.title || '无标题'}
                    </div>
                    <div className={`text-[12px] mt-0.5 ${selectedFile?.id === file.id ? 'text-white/70' : 'text-[#86868b]'}`}>
                      {formatDate(file.updated_at)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {(selectedFile || isCreating) ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-white border-b border-[#d2d2d7]/50 px-6 py-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="文档标题"
                  className="w-full text-[20px] font-semibold text-[#1d1d1f] bg-transparent border-none outline-none placeholder-[#86868b]"
                />
              </div>

              <div className="bg-white border-b border-[#d2d2d7]/30 px-6 py-2 flex items-center gap-1">
                <button
                  onClick={() => setShowPreview(false)}
                  className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                    !showPreview 
                      ? 'bg-[#1d1d1f] text-white' 
                      : 'text-[#86868b] hover:bg-[#f5f5f7]'
                  }`}
                >
                  编辑
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                    showPreview 
                      ? 'bg-[#1d1d1f] text-white' 
                      : 'text-[#86868b] hover:bg-[#f5f5f7]'
                  }`}
                >
                  预览
                </button>
              </div>

              <div className="flex-1 overflow-hidden p-6">
                <div className={`h-full ${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
                  <div className="relative h-full">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="开始编写 Markdown..."
                      className="w-full h-full p-5 bg-white rounded-xl border border-[#d2d2d7]/50 resize-none text-[14px] leading-relaxed text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-shadow"
                      style={{ fontFamily: "'SF Mono', Monaco, Menlo, monospace" }}
                    />
                  </div>
                  
                  {showPreview && (
                    <div className="h-full overflow-y-auto p-5 bg-white rounded-xl border border-[#d2d2d7]/50">
                      <div 
                        className="prose prose-sm max-w-none"
                        style={{
                          fontFamily: "'Inter', -apple-system, sans-serif",
                          color: '#1d1d1f'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: content 
                            ? DOMPurify.sanitize(marked.parse(content) as string)
                            : '<p style="color:#86868b">预览区域</p>'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border-t border-[#d2d2d7]/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCreating ? (
                    <button
                      onClick={handleCreate}
                      disabled={isSaving || !title.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? '创建中...' : '创建'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving || !title.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? '保存中...' : '保存'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setTitle('');
                      setContent('');
                      setIsCreating(false);
                      setShareLink('');
                    }}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {selectedFile && (
                    <>
                      <button
                        onClick={() => handleDelete(selectedFile.id)}
                        className="px-4 py-2 text-[14px] font-medium text-[#ff3b30] hover:bg-[#fff5f5] rounded-lg transition-colors"
                      >
                        删除
                      </button>
                      <button
                        onClick={handleShare}
                        className="btn-secondary text-[14px] py-2"
                      >
                        分享
                      </button>
                    </>
                  )}
                </div>
              </div>

              {shareError && (
                <div className="mx-6 mb-4 p-3 bg-[#fff5f5] border border-[#ff3b30]/20 rounded-lg">
                  <p className="text-[13px] text-[#ff3b30]">{shareError}</p>
                </div>
              )}

              {shareLink && (
                <div className="mx-6 mb-4 p-4 bg-[#f5f5f7] rounded-lg flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#86868b] mb-1">分享链接（24小时后过期）</p>
                    <p className="text-[14px] text-[#0071e3] truncate">{shareLink}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="flex-shrink-0 px-4 py-2 bg-[#0071e3] text-white text-[13px] font-medium rounded-lg hover:bg-[#0077ed] transition-colors"
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#005bb5] flex items-center justify-center shadow-lg shadow-[#0071e3]/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">选择或创建文档</h2>
                <p className="text-[15px] text-[#86868b] mb-6">从左侧选择一个文档开始编辑，或创建新文档</p>
                <button
                  onClick={startNewFile}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新建文档
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
