'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Trash2, Plus, X } from "lucide-react";
import { updatePattern, deletePattern } from "./actions";

interface EditPatternFormProps {
  pattern: any
}

export default function EditPatternForm({ pattern }: EditPatternFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: pattern.name || '',
    slug: pattern.slug || '',
    short_description: pattern.short_description || '',
    purpose: pattern.purpose || '',
    user_problem: pattern.user_problem || '',
    ux_effect: pattern.ux_effect || '',
    implementation_notes: pattern.implementation_notes || '',
    best_for: pattern.best_for || '',
    risks: pattern.risks || '',
    cognitive_load: pattern.cognitive_load || '',
    emotional_effect: pattern.emotional_effect || '',
    mobile_compatibility: pattern.mobile_compatibility || '',
    accessibility_notes: pattern.accessibility_notes || '',
    visualization_data: {
      structure: pattern.visualization_data?.structure || [],
      layout_hint: pattern.visualization_data?.layout_hint || 'grid',
      react_example: pattern.visualization_data?.react_example || ''
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStructureChange = (index: number, field: string, value: string) => {
    const newStructure = [...formData.visualization_data.structure]
    newStructure[index] = { ...newStructure[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      visualization_data: { ...prev.visualization_data, structure: newStructure }
    }))
  }

  const addStructureItem = () => {
    setFormData(prev => ({
      ...prev,
      visualization_data: {
        ...prev.visualization_data,
        structure: [...prev.visualization_data.structure, { name: '', description: '', type: 'container' }]
      }
    }))
  }

  const removeStructureItem = (index: number) => {
    const newStructure = formData.visualization_data.structure.filter((_: any, i: number) => i !== index)
    setFormData(prev => ({
      ...prev,
      visualization_data: { ...prev.visualization_data, structure: newStructure }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updatePattern(pattern.id, formData)
    setIsSaving(false)
    
    if (res.error) {
      alert('保存エラー: ' + res.error)
    } else {
      router.push('/admin/patterns')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!confirm('このパターンを削除しますか？この操作は取り消せません。')) return
    
    setIsDeleting(true)
    const res = await deletePattern(pattern.id)
    setIsDeleting(false)
    
    if (res.error) {
      alert('削除エラー: ' + res.error)
    } else {
      router.push('/admin/patterns')
      router.refresh()
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">パターン名</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">スラッグ</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">UX目的</Label>
            <Input id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="例: CV向上、離脱防止" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description">簡単な説明</Label>
            <Input id="short_description" name="short_description" value={formData.short_description} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="user_problem">解決するユーザー課題</Label>
        <Textarea id="user_problem" name="user_problem" value={formData.user_problem} onChange={handleChange} rows={3} />
      </div>

      <div className="space-y-4">
        <Label htmlFor="ux_effect">UX的効果</Label>
        <Textarea id="ux_effect" name="ux_effect" value={formData.ux_effect} onChange={handleChange} rows={3} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label htmlFor="best_for">向いているケース</Label>
          <Textarea id="best_for" name="best_for" value={formData.best_for} onChange={handleChange} rows={3} />
        </div>
        <div className="space-y-4">
          <Label htmlFor="risks">注意点・リスク</Label>
          <Textarea id="risks" name="risks" value={formData.risks} onChange={handleChange} rows={3} />
        </div>
      </div>

      <div className="border-t pt-10">
        <h2 className="text-xl font-bold mb-6">Visualization Data</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Layout Hint</Label>
            <Input 
              value={formData.visualization_data.layout_hint} 
              onChange={(e) => setFormData(prev => ({
                ...prev,
                visualization_data: { ...prev.visualization_data, layout_hint: e.target.value }
              }))}
              placeholder="grid, sidebar, stack, hero-split"
            />
          </div>

          <div className="space-y-4">
            <Label>Structure Components</Label>
            <div className="space-y-3">
              {formData.visualization_data.structure.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 p-4 border rounded-lg bg-slate-50 relative group">
                  <div className="grid gap-3 flex-1 md:grid-cols-3">
                    <Input 
                      placeholder="Name" 
                      value={item.name} 
                      onChange={(e) => handleStructureChange(idx, 'name', e.target.value)} 
                    />
                    <Input 
                      placeholder="Type (image, text, button...)" 
                      value={item.type} 
                      onChange={(e) => handleStructureChange(idx, 'type', e.target.value)} 
                    />
                    <Input 
                      placeholder="Description" 
                      value={item.description} 
                      onChange={(e) => handleStructureChange(idx, 'description', e.target.value)} 
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeStructureItem(idx)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full border-dashed" onClick={addStructureItem}>
                <Plus className="mr-2 size-4" />
                要素を追加
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>React Example Code</Label>
            <Textarea 
              className="font-mono text-xs" 
              rows={10}
              value={formData.visualization_data.react_example}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                visualization_data: { ...prev.visualization_data, react_example: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-10">
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting || isSaving}
        >
          {isDeleting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Trash2 className="mr-2 size-4" />}
          削除
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || isDeleting}
          className="px-8"
        >
          {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          変更を保存
        </Button>
      </div>
    </div>
  )
}
