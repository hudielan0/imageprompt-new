import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - 点击回到首页 */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          ImagePrompt
        </Link>

        {/* 导航链接 */}
        <div className="hidden md:flex gap-8">
          <Link href="/image-to-prompt" className="text-gray-600 hover:text-blue-600 transition">
            图片转提示词
          </Link>
          <Link href="/prompt-generator" className="text-gray-600 hover:text-blue-600 transition">
            提示词生成器
          </Link>
          <Link href="/image-generator" className="text-gray-600 hover:text-blue-600 transition">
            AI 图片生成
          </Link>
          <Link href="/describe-image" className="text-gray-600 hover:text-blue-600 transition">
            图片描述
          </Link>
        </div>

        {/* 按钮 */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          开始使用
        </button>
      </nav>
    </header>
  );
}