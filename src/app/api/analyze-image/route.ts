import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: '没有上传图片' }, { status: 400 });
    }

    console.log('收到图片:', file.name, file.type, file.size);

    // 模拟 AI 分析的延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟的提示词
    const mockPrompt = `A stunning photograph with vibrant colors and excellent composition. The image features detailed textures, natural lighting, and a balanced exposure. Professional photography style with sharp focus and beautiful depth of field. High-resolution capture with artistic perspective and creative framing.`;

    console.log('生成提示词成功');

    return NextResponse.json({ success: true, prompt: mockPrompt });
    
  } catch (error) {
    console.error('处理失败:', error);
    return NextResponse.json(
      { error: '处理失败，请重试' }, 
      { status: 500 }
    );
  }
}