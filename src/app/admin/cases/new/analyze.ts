'use server';

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function analyzeUrl(url: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  
  try {
    // 1. Fetch content (Server-side to avoid CORS)
    let html = ""
    try {
      const response = await fetch(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        next: { revalidate: 3600 } 
      })
      html = await response.text()
    } catch (e) {
      console.error("Fetch error:", e)
      return { error: "URLの読み込みに失敗しました。URLが正しいか、またはアクセス制限がないか確認してください。" }
    }

    // 2. Extract basic metadata from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i)
    const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/i)
    const h1Match = html.match(/<h1.*?>(.*?)<\/h1>/i)
    const h2Match = html.match(/<h2.*?>(.*?)<\/h2>/i)

    const pageTitle = titleMatch ? titleMatch[1] : ''
    const ogImage = ogImageMatch ? ogImageMatch[1] : ''
    const metaDescription = metaDescMatch ? metaDescMatch[1] : ''
    const h1 = h1Match ? h1Match[1].replace(/<[^>]*>?/gm, '') : ''
    const h2 = h2Match ? h2Match[1].replace(/<[^>]*>?/gm, '') : ''

    // Simplified body text extraction
    const bodyText = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
      .replace(/<[^>]+>/gm, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 6000)

    // 3. Prepare content for AI
    const extractedContent = `
      URL: ${url}
      Title: ${pageTitle}
      Description: ${metaDescription}
      H1: ${h1}
      H2: ${h2}
      Main Content (truncated): ${bodyText}
    `

    // 4. Call Gemini for Analysis
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      }
    });

    const prompt = `あなたは世界最高峰のUXリサーチャー兼UIデザイナーです。提供されたウェブページの内容を分析し、以下のJSON形式で詳細なUX/UIレポートを生成してください。

    ### 出力JSON構造:
    {
      "title": "ページタイトル",
      "service_name": "サービス名",
      "summary": "ページの概要",
      "target_users": "ターゲットユーザー",
      "user_needs": "ユーザーニーズ",
      "ux_strategy": "UX戦略",
      "information_architecture": "情報設計",
      "ui_tone": "デザインのトーン",
      "main_cta": "メインCTA",
      "conversion_points": "コンバージョンポイント",
      "trust_elements": "信頼醸成要素",
      "friction_points": "フリクション（課題点）",
      "good_points": "優れた点",
      "improvement_points": "改善案",
      "suggested_tags": ["タグ1", "タグ2"],
      "suggested_category": "Web App / Mobile App / Other",
      "ux_positioning": [
        { "axis": "保守的", "label_left": "保守的", "label_right": "先進的", "score": 50, "comment": "理由" },
        { "axis": "論理的", "label_left": "論理的", "label_right": "感情的", "score": 50, "comment": "理由" },
        { "axis": "シンプル", "label_left": "シンプル", "label_right": "情報量多め", "score": 50, "comment": "理由" },
        { "axis": "大衆向け", "label_left": "大衆向け", "label_right": "専門家向け", "score": 50, "comment": "理由" },
        { "axis": "信頼感", "label_left": "信頼感重視", "label_right": "革新性重視", "score": 50, "comment": "理由" },
        { "axis": "硬い", "label_left": "硬い", "label_right": "柔らかい", "score": 50, "comment": "理由" },
        { "axis": "実務的", "label_left": "実務的", "label_right": "遊び心", "score": 50, "comment": "理由" },
        { "axis": "ミニマル", "label_left": "ミニマル", "label_right": "リッチ", "score": 50, "comment": "理由" }
      ],
      "extracted_patterns": [
        {
          "name": "パターン名",
          "short_description": "説明",
          "purpose": "目的",
          "user_problem": "解決する課題",
          "ux_effect": "効果",
          "implementation_notes": "実装注記",
          "best_for": "適したケース",
          "risks": "リスク",
          "cognitive_load": "認知負荷",
          "emotional_effect": "感情的効果",
          "mobile_compatibility": "モバイル対応",
          "accessibility_notes": "アクセシビリティ",
          "ux_positioning": [
             { "axis": "革新的", "label_left": "保守的", "label_right": "先進的", "score": 50, "comment": "理由" }
          ],
          "visualization_data": {
            "structure": [
              { "name": "要素名", "description": "役割", "type": "image" }
            ],
            "layout_hint": "grid",
            "react_example": "Reactコード（マークダウン記法不可、引用符は適切にエスケープすること）"
          }
        }
      ]
    }

    ### 分析要件:
    1. パターン抽出は最大3つまでに絞ってください。
    2. 【最重要】出力は必ず有効なJSONにしてください。特に \`react_example\` などの値の中で「実際の改行」を使用しないでください。改行が必要な場合は必ずエスケープシーケンス（\\n）を使用し、ダブルクォートも必ずエスケープ（\\"）してください。
    3. 全ての解説は日本語で行ってください。
    4. 途中で出力が切れないよう、各項目の説明は簡潔にしてください。

    Content to analyze:
    ${extractedContent}`

    const result = await model.generateContent(prompt)
    const resultText = result.response.text();

    if (!resultText) {
      return { error: 'Failed to generate analysis.' };
    }

    // Clean up potential markdown code blocks
    let jsonString = resultText.trim();
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const analysis = JSON.parse(jsonString);
      return { 
        data: {
          ...analysis,
          thumbnail_url: ogImage || null
        } 
      };
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      return { error: `分析結果の読み込みに失敗しました (JSON形式エラー): ${parseError.message}` };
    }

  } catch (error: any) {
    console.error('Analysis error:', error)
    return { error: error.message || 'An unexpected error occurred during analysis.' }
  }
}
