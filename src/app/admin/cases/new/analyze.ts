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
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      }
    });

    const prompt = `あなたは世界最高峰のUXリサーチャー兼UIデザイナーです。提供されたウェブページの内容を分析し、JSON形式で詳細なレポートを生成してください。

    ### パターン命名に関する重要ルール:
    1. パターン名は、開発者やデザイナーが一般的に使用する名称（コンポーネント名）を優先してください。
    2. 以下の「標準パターン辞書」に該当するものがある場合は、必ずその名称を使用してください。
       - **ナビゲーション**: Sticky Header, Mega Menu, Breadcrumbs, Side Navigation, Tab Bar, Drawer, Hamburger Menu
       - **レイアウト**: Hero Section, Bento Grid, Card Grid, Masonry Layout, Accordion, Split Screen, Holy Grail Layout
       - **フィード・一覧**: Infinite Scroll, Pagination, Skeleton Screen, Pull to Refresh, Empty State
       - **インタラクション**: Modal Window, Popover, Tooltip, Toast Notification, Floating Action Button (FAB)
       - **入力・フォーム**: Multi-step Form (Stepper), In-place Editing, Password Strength Meter, Input Validation
       - **コンテンツ要素**: Carousel, Progress Bar, Pricing Table, Social Proof Section, User Reviews, Search Bar (Autocomplete)
    3. 辞書にない場合でも、具体的すぎる固有名称（例: "A社のふわふわボタン"）は避け、一般的・抽象的な名称（例: "Animated Toggle"）に変換してください。
    4. 最大2つまでに絞ってください。

    ### 出力JSON構造:
    {
      "title": "ページタイトル",
      "service_name": "サービス名",
      "summary": "概要(100字程度)",
      "target_users": "ターゲット",
      "user_needs": "ニーズ",
      "ux_strategy": "戦略",
      "information_architecture": "IA",
      "ui_tone": "トーン",
      "main_cta": "CTA",
      "conversion_points": "CV点",
      "trust_elements": "信頼要素",
      "friction_points": "課題",
      "good_points": "良い点",
      "improvement_points": "改善案",
      "suggested_tags": ["タグ1"],
      "suggested_category": "Web App / Mobile App / Other",
      "ux_positioning": [
        { "axis": "保守的", "label_left": "保守的", "label_right": "先進的", "score": 50, "comment": "理由" }
      ],
      "extracted_patterns": [
        {
          "name": "パターン名",
          "short_description": "説明",
          "purpose": "目的",
          "user_problem": "課題",
          "ux_effect": "効果",
          "implementation_notes": "注記",
          "best_for": "ケース",
          "risks": "リスク",
          "cognitive_load": "負荷",
          "emotional_effect": "効果",
          "mobile_compatibility": "対応",
          "accessibility_notes": "アクセシビリティ",
          "ux_positioning": [
            { "axis": "革新的", "label_left": "保守的", "label_right": "先進的", "score": 50, "comment": "理由" }
          ],
          "visualization_data": {
            "structure": [{ "name": "要素", "description": "役割", "type": "image" }],
            "layout_hint": "grid",
            "react_example": [
              "import React from 'react';",
              "// 簡潔なReactコード(各行を配列の要素にする)"
            ]
          }
        }
      ]
    }

    ### 分析要件:
    1. 【最重要】出力は必ず有効なJSONにしてください。JSONのキーや文字列値は必ずダブルクォート(")で囲んでください。
    2. react_example は文字列の配列として出力してください（改行コードを使わず、行ごとに配列の1要素とする）。
    3. 全ての解説は日本語で行ってください。

    Content to analyze:
    ${extractedContent}`

    const result = await model.generateContent(prompt)
    const resultText = result.response.text();

    if (!resultText) {
      return { error: 'Failed to generate analysis.' };
    }

    // Clean up potential markdown code blocks and invisible characters
    let jsonString = resultText.trim();
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    // Remove potential control characters that break JSON.parse
    jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    try {
      const analysis = JSON.parse(jsonString);
      
      // react_example が配列の場合は文字列に結合して既存のデータ構造に合わせる
      if (analysis.extracted_patterns && Array.isArray(analysis.extracted_patterns)) {
        analysis.extracted_patterns.forEach((pattern: any) => {
          if (pattern.visualization_data && Array.isArray(pattern.visualization_data.react_example)) {
            pattern.visualization_data.react_example = pattern.visualization_data.react_example.join('\n');
          }
        });
      }

      return { 
        data: {
          ...analysis,
          thumbnail_url: ogImage || null
        } 
      };
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      return { 
        error: `分析結果の読み込みに失敗しました (JSON形式エラー): ${parseError.message}`,
        rawText: jsonString
      };
    }

  } catch (error: any) {
    console.error('Analysis error:', error)
    return { error: error.message || 'An unexpected error occurred during analysis.' }
  }
}
