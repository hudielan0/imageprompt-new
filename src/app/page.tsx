'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  // ✅ 修复：改为 files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
      }
      
      setSelectedFile(file);
      
      // 生成预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 生成提示词
  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('请先选择图片！');
      return;
    }

    setLoading(true);
    setPrompt('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPrompt(data.prompt);
      } else {
        alert('生成失败：' + data.error);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 复制提示词
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    alert('已复制到剪贴板！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            图片转提示词工具
          </h1>
          <p className="text-xl text-gray-600">
            上传图片，AI 帮你生成详细的提示词
          </p>
        </div>

        {/* 主要内容区 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* 上传区域 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              选择图片
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          {/* 图片预览 */}
          {preview && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                图片预览
              </h3>
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={preview}
                  alt="预览"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* 生成按钮 */}
          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={!selectedFile || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform transition hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? '生成中...' : '生成提示词'}
            </button>
          </div>

          {/* 结果显示 */}
          {prompt && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  生成的提示词
                </h3>
                <button
                  onClick={handleCopy}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  复制
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {prompt}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-8 text-gray-600">
          <p>由 AI 驱动 | 支持多种图片格式</p>
        </div>
      </div>
    </div>
  );
}