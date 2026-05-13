'use client'

import { useState } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
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
import { updateCase } from "../../../../actions"

interface CaseData {
  id: string
  title: string
  service_name: string
  category: string
  url: string
  summary: string
  ux_notes: string
  good_points: string
  improvement_points: string
  thumbnail_url: string
  target_users: string
  user_needs: string
  ux_strategy: string
  information_architecture: string
  ui_tone: string
  main_cta: string
  conversion_points: string
  trust_elements: string
  friction_points: string
  reusable_patterns: string
  ux_positioning: any[]
  tags?: string // comma separated string
}

export default function EditCaseForm({ initialData }: { initialData: CaseData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnail, setThumbnail] = useState(initialData.thumbnail_url || '')
  
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    service_name: initialData.service_name || '',
    category: initialData.category || 'Web App',
    url: initialData.url || '',
    summary: initialData.summary || '',
    ux_notes: initialData.ux_notes || '',
    good_points: initialData.good_points || '',
    improvement_points: initialData.improvement_points || '',
    tags: initialData.tags || '',
    target_users: initialData.target_users || '',
    user_needs: initialData.user_needs || '',
    ux_strategy: initialData.ux_strategy || '',
    information_architecture: initialData.information_architecture || '',
    ui_tone: initialData.ui_tone || '',
    main_cta: initialData.main_cta || '',
    conversion_points: initialData.conversion_points || '',
    trust_elements: initialData.trust_elements || '',
    friction_points: initialData.friction_points || '',
    reusable_patterns: initialData.reusable_patterns || '',
    ux_positioning: initialData.ux_positioning || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const fd = new FormData(e.currentTarget)
    // Add positioning data
    fd.set('ux_positioning', JSON.stringify(formData.ux_positioning))
    
    const res = await updateCase(initialData.id, fd)
    
    if (res?.error) {
      alert('更新に失敗しました: ' + res.error)
      setIsSubmitting(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
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
        <h1 className="text-3xl font-bold">事例を編集</h1>
        <p className="text-muted-foreground text-sm mt-2">
          事例の詳細情報を編集します。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <input type="hidden" name="url" value={formData.url} />

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
              <Label htmlFor="url_display">対象URL</Label>
              <Input id="url_display" value={formData.url} readOnly className="bg-muted text-muted-foreground" />
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
            <h3 className="text-xl font-semibold border-b pb-2">UX分析項目</h3>
            
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
                      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none w-0.5 h-3 bg-border left-1/2" />
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
          <Button type="submit" size="lg" className="px-10 text-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                変更を保存する
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
