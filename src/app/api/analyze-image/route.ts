import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    // 获取环境变量中的 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: '服务器配置错误：缺少 API Key' },
        { status: 500 }
      );
    }

    // 获取上传的图片
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '请上传图片文件' },
        { status: 400 }
      );
    }

    // 将图片转换为 base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 初始化 Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // 构建提示词
    const prompt = `请仔细分析这张图片，并生成一个详细的英文提示词（prompt），用于AI图像生成工具。

要求：
1. 描述主要主题和内容
2. 描述风格、色调、光线
3. 描述构图和视角
4. 描述细节和质感
5. 描述情绪和氛围
6. 使用专业的摄影和艺术术语
7. 提示词要详细但简洁，约100-150词

请直接输出提示词，不需要任何解释或额外说明。`;

    // 调用 Gemini API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const generatedPrompt = response.text();

    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
    });

  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json(
      { error: '处理失败，请重试' },
      { status: 500 }
    );
  }
}