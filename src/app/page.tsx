'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function ImageToPromptPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setGeneratedPrompt(''); // 清空之前的提示词
      };
      reader.readAsDataURL(file);
    }
  };

  // 重置上传
  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedPrompt('');
    setIsCopied(false);
  };

  // 生成提示词（模拟）
  const handleGenerate = async () => {
    setIsLoading(true);
    
    // 模拟 AI 处理时间（2秒）
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟生成的提示词
    const mockPrompt = `A beautiful scenic photograph featuring four people sitting on a reflective surface near a tranquil lake, surrounded by towering karst mountains covered in lush greenery. The scene captures a serene moment with crystal-clear reflections in the water. Natural lighting, outdoor photography, travel photography style, peaceful atmosphere, summer vibes, scenic landscape, tourism destination.`;
    
    setGeneratedPrompt(mockPrompt);
    setIsLoading(false);
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-xl font-semibold mb-2">上传图片</h3>
                  <p className="text-gray-500 mb-4">
                    支持 JPG、PNG、WEBP 格式
                  </p>
                  <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer inline-block">
                    选择文件
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  {/* 图片预览 */}
                  <div className="mb-6">
                    <img
                      src={uploadedImage}
                      alt="上传的图片"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={handleReset}
                      disabled={isLoading}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      重新上传
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                  {/* 提示词显示区域 */}
                  {generatedPrompt && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg text-gray-800">生成的提示词</h4>
                        <button
                          onClick={handleCopy}
                          className="bg-white px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition border border-blue-200 flex items-center gap-2"
                        >
                          {isCopied ? (
                            <>
                              <span>✓</span>
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <span>📋</span>
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {generatedPrompt}
                      </p>
                    </div>
                  )}

                  {/* 加载状态提示 */}
                  {isLoading && (
                    <div className="mt-6 p-6 bg-blue-50 rounded-lg text-center">
                      <div className="text-blue-600 mb-2">AI 正在分析图片...</div>
                      <div className="text-sm text-gray-600">这可能需要几秒钟</div>
                    </div>
                  )}

                  {/* 未生成时的提示 */}
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