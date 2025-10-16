'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function ImageToPromptPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null); // 🆕 保存原始文件
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState('');

  // 验证文件
  const validateFile = (file: File): string | null => {
    console.log('验证文件:', file.name, file.type, file.size);
    
    if (!file.type.startsWith('image/')) {
      return '请上传图片文件（JPG、PNG、WEBP）';
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return '图片大小不能超过 10MB';
    }
    
    return null;
  };

  // 处理文件
  const processFile = (file: File) => {
    console.log('开始处理文件:', file);
    setError('');
    setFileInfo(`正在处理: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    const errorMsg = validateFile(file);
    if (errorMsg) {
      console.log('文件验证失败:', errorMsg);
      setError(errorMsg);
      setFileInfo('');
      return;
    }

    const reader = new FileReader();
    
    reader.onloadstart = () => {
      console.log('开始读取文件...');
      setFileInfo(`读取中: ${file.name}`);
    };
    
    reader.onload = (event) => {
      console.log('文件读取成功!');
      setUploadedImage(event.target?.result as string);
      setFile(file); // 🆕 保存原始文件
      setGeneratedPrompt('');
      setFileInfo('');
    };
    
    reader.onerror = () => {
      console.error('文件读取失败!');
      setError('文件读取失败，请重试');
      setFileInfo('');
    };
    
    reader.readAsDataURL(file);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange 触发了!', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('找到文件:', file.name);
      processFile(file);
    } else {
      console.log('没有选择文件');
    }
  };

  // 处理拖拽
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    console.log('文件拖放了!');

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  // 重置上传
  const handleReset = () => {
    setUploadedImage(null);
    setFile(null); // 🆕 清空文件
    setGeneratedPrompt('');
    setIsCopied(false);
    setError('');
    setFileInfo('');
  };

  // 生成提示词 - 🆕 调用真实 API
  const handleGenerate = async () => {
    if (!file) {
      setError('没有文件可以分析');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('image', file);

      // 调用 API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '分析失败');
      }

      setGeneratedPrompt(data.prompt);
    } catch (err) {
      console.error('生成失败:', err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 复制提示词
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              图片转提示词
            </h1>
            <p className="text-lg text-gray-600">
              上传图片，AI 自动生成详细的提示词
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {!uploadedImage ? (
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-all
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 scale-105' 
                      : 'border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  <div className="text-6xl mb-4">
                    {isDragging ? '📥' : '📸'}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragging ? '松开鼠标上传' : '上传图片'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isDragging 
                      ? '放开即可上传' 
                      : '拖拽文件到这里，或点击选择文件'
                    }
                  </p>
                  
                  {fileInfo && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
                      ⏳ {fileInfo}
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block">
                    选择文件
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      onClick={(e) => {
                        console.log('input 被点击了');
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />
                  </label>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    支持 JPG、PNG、WEBP 格式，最大 10MB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 relative group">
                    <img
                      src={uploadedImage}
                      alt="上传的图片"
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm">✓ 图片已上传</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={handleReset}
                      disabled={isLoading}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      重新上传
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          生成中...
                        </>
                      ) : (
                        '生成提示词'
                      )}
                    </button>
                  </div>

                  {generatedPrompt && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">生成的提示词</h4>
                        <button
                          onClick={handleCopy}
                          className="bg-white px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition border flex items-center gap-2"
                        >
                          {isCopied ? '✓ 已复制' : '📋 复制'}
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {generatedPrompt}
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="mt-6 p-6 bg-blue-50 rounded-lg text-center">
                      <div className="text-blue-600 mb-2">AI 正在分析图片...</div>
                      <div className="text-sm text-gray-600">这可能需要几秒钟</div>
                    </div>
                  )}

                  {!isLoading && !generatedPrompt && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-600">
                        点击"生成提示词"按钮，AI 将分析图片并生成详细的提示词
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}