'use client'

import { useState } from 'react'
import Link from "next/link"
import { ArrowLeft, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { createCase } from "./actions"
import { analyzeUrl } from "./analyze"

export default function NewCasePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [rawErrorText, setRawErrorText] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    service_name: '',
    category: 'Web App',
    summary: '',
    ux_notes: '',
    good_points: '',
    improvement_points: '',
    tags: '',
    target_users: '',
    user_needs: '',
    ux_strategy: '',
    information_architecture: '',
    ui_tone: '',
    main_cta: '',
    conversion_points: '',
    trust_elements: '',
    friction_points: '',
    reusable_patterns: '',
    ux_positioning: [] as any[],
    extracted_patterns: [] as any[],
  })

  const handleAnalyze = async () => {
    if (!url) {
      alert('URLを入力してください')
      return
    }

    setIsAnalyzing(true)
    setRawErrorText('')
    try {
      const res = await analyzeUrl(url)
      if (res.error) {
        alert('分析エラー: ' + res.error)
        if (res.rawText) {
          setRawErrorText(res.rawText)
        }
        return
      }

      if (res.data) {
        const d = res.data
        setFormData(prev => ({
          ...prev,
          title: d.title || prev.title,
          service_name: d.service_name || prev.service_name,
          category: d.suggested_category && ['Web App', 'Mobile App', 'Other'].includes(d.suggested_category) 
            ? d.suggested_category 
            : prev.category,
          summary: d.summary || prev.summary,
          target_users: d.target_users || prev.target_users,
          user_needs: d.user_needs || prev.user_needs,
          ux_strategy: d.ux_strategy || prev.ux_strategy,
          information_architecture: d.information_architecture || prev.information_architecture,
          ui_tone: d.ui_tone || prev.ui_tone,
          main_cta: d.main_cta || prev.main_cta,
          conversion_points: d.conversion_points || prev.conversion_points,
          trust_elements: d.trust_elements || prev.trust_elements,
          friction_points: d.friction_points || prev.friction_points,
          good_points: d.good_points || prev.good_points,
          improvement_points: d.improvement_points || prev.improvement_points,
          reusable_patterns: d.reusable_patterns || prev.reusable_patterns,
          ux_positioning: d.ux_positioning || prev.ux_positioning,
          extracted_patterns: d.extracted_patterns || prev.extracted_patterns,
          tags: d.suggested_tags ? d.suggested_tags.join(', ') : prev.tags
        }))
        if (d.thumbnail_url) {
          setThumbnail(d.thumbnail_url)
        }
      }
    } catch (e) {
      alert('予期せぬエラーが発生しました')
      console.error(e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // Add the url and thumbnail state to the formData manually if needed, 
    // but they are already in hidden inputs/fields.
    await createCase(formData)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 size-4" />
          一覧に戻る
        </Link>
        <h1 className="text-3xl font-bold">新規事例を追加</h1>
        <p className="text-muted-foreground text-sm mt-2">
          URLからAI分析を利用して、新しいUI/UX事例をナレッジベースに登録します。
        </p>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mb-10 border border-border">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Wand2 className="mr-2 size-5 text-primary" />
          URLからAI分析
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="ai_url">分析するURL</Label>
            <Input 
              id="ai_url" 
              type="url" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button 
            type="button"
            onClick={handleAnalyze} 
            disabled={!url || isAnalyzing}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                分析中...
              </>
            ) : (
              'AIで分析・自動入力'
            )}
          </Button>
        </div>
      </div>

      {rawErrorText && (
        <div className="bg-destructive/10 border-destructive/20 border p-4 rounded-lg mb-10">
          <h3 className="text-destructive font-bold mb-2">生成された生データ (デバッグ用)</h3>
          <p className="text-sm text-muted-foreground mb-2">JSONのパースに失敗した文字列です。どこでフォーマットが崩れているか確認できます。</p>
          <Textarea 
            className="font-mono text-xs h-64 bg-background" 
            value={rawErrorText} 
            readOnly 
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* URL field for the form submission */}
        <input type="hidden" name="url" value={url} />
        <input type="hidden" name="ux_positioning" value={JSON.stringify(formData.ux_positioning)} />
        <input type="hidden" name="extracted_patterns" value={JSON.stringify(formData.extracted_patterns)} />

        <div className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">基本情報</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">タイトル <span className="text-destructive">*</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service_name">サービス名 <span className="text-destructive">*</span></Label>
                <Input id="service_name" name="service_name" value={formData.service_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">カテゴリー <span className="text-destructive">*</span></Label>
                <Select name="category" value={formData.category} onValueChange={(val) => setFormData(p => ({...p, category: val ?? p.category}))}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web App">Web App</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">サムネイル画像URL</Label>
                <Input id="thumbnail" name="thumbnail" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="summary">概要 <span className="text-destructive">*</span></Label>
              <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className="h-20" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">タグ（カンマ区切り）</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">UX分析 (AI生成項目)</h3>
            
            {/* UX Positioning Section */}
            <div className="bg-card border rounded-xl p-6 space-y-8">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">UX Positioning</h4>
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                {formData.ux_positioning?.map((pos, index) => (
                  <div key={pos.axis} className="space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={pos.score < 40 ? "text-primary font-bold" : "text-muted-foreground"}>{pos.label_left}</span>
                      <span className={pos.score > 60 ? "text-primary font-bold" : "text-muted-foreground"}>{pos.label_right}</span>
                    </div>
                    <div className="relative flex items-center h-6">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pos.score} 
                        onChange={(e) => {
                          const newPos = [...formData.ux_positioning];
                          newPos[index] = { ...newPos[index], score: parseInt(e.target.value) };
                          setFormData(p => ({...p, ux_positioning: newPos}));
                        }}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 pointer-events-none w-0.5 h-3 bg-border left-1/2" 
                      />
                    </div>
                    <Input 
                      value={pos.comment} 
                      onChange={(e) => {
                        const newPos = [...formData.ux_positioning];
                        newPos[index] = { ...newPos[index], comment: e.target.value };
                        setFormData(p => ({...p, ux_positioning: newPos}));
                      }}
                      className="text-xs h-7 px-2"
                      placeholder="コメントを入力..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Patterns Section */}
            {formData.extracted_patterns && formData.extracted_patterns.length > 0 && (
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Extracted UX/UI Patterns</h4>
                <p className="text-xs text-muted-foreground">AIがこのサービスから抽出したUI/UXパターンです。保存時に自動的にPattern Libraryに登録・紐付けられます。</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {formData.extracted_patterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2 bg-background relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const newPatterns = formData.extracted_patterns.filter((_, i) => i !== index);
                          setFormData(p => ({...p, extracted_patterns: newPatterns}));
                        }}
                      >
                        &times;
                      </Button>
                      <div className="font-semibold">{pattern.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{pattern.short_description}</div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{pattern.purpose}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="target_users">ターゲットユーザー</Label>
                <Textarea id="target_users" name="target_users" value={formData.target_users} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user_needs">ユーザーの課題・ニーズ</Label>
                <Textarea id="user_needs" name="user_needs" value={formData.user_needs} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="ux_strategy">UX戦略・アプローチ</Label>
                <Textarea id="ux_strategy" name="ux_strategy" value={formData.ux_strategy} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="information_architecture">情報設計 (IA)</Label>
                <Textarea id="information_architecture" name="information_architecture" value={formData.information_architecture} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="ui_tone">UIトーン・世界観</Label>
                <Input id="ui_tone" name="ui_tone" value={formData.ui_tone} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="main_cta">主要なCTA</Label>
                <Input id="main_cta" name="main_cta" value={formData.main_cta} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="conversion_points">コンバージョンポイント</Label>
                <Textarea id="conversion_points" name="conversion_points" value={formData.conversion_points} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trust_elements">信頼性構築の要素</Label>
                <Textarea id="trust_elements" name="trust_elements" value={formData.trust_elements} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="friction_points">フリクション (懸念点)</Label>
                <Textarea id="friction_points" name="friction_points" value={formData.friction_points} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reusable_patterns">再利用可能なパターン</Label>
                <Textarea id="reusable_patterns" name="reusable_patterns" value={formData.reusable_patterns} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">総評・考察</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="good_points">良い点</Label>
                <Textarea id="good_points" name="good_points" value={formData.good_points} onChange={handleChange} className="h-32" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="improvement_points">改善余地</Label>
                <Textarea id="improvement_points" name="improvement_points" value={formData.improvement_points} onChange={handleChange} className="h-32" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ux_notes">その他 UX観点メモ</Label>
              <Textarea id="ux_notes" name="ux_notes" value={formData.ux_notes} onChange={handleChange} className="h-32" />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-4 pb-10">
          <Button type="submit" size="lg" className="px-10 text-lg">
            事例を保存する
          </Button>
        </div>
      </form>
    </div>
  )
}
