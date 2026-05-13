'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit3, ExternalLink, Trash2, CheckSquare, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { deletePattern, deletePatterns } from "./actions"

interface Pattern {
  id: string
  name: string
  slug: string
  purpose: string
  cognitive_load: string
  updated_at: string
}

export default function PatternTable({ patterns }: { patterns: Pattern[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === patterns.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(patterns.map(p => p.id))
    }
  }

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('このパターンを削除してもよろしいですか？')) return
    
    setIsDeleting(true)
    const res = await deletePattern(id)
    if (res.error) {
      alert('削除に失敗しました: ' + res.error)
    }
    setIsDeleting(false)
  }

  const handleDeleteBulk = async () => {
    if (!confirm(`${selectedIds.length}件のパターンを削除してもよろしいですか？`)) return
    
    setIsDeleting(true)
    const res = await deletePatterns(selectedIds)
    if (res.error) {
      alert('削除に失敗しました: ' + res.error)
    } else {
      setSelectedIds([])
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-red-700 font-medium">
            {selectedIds.length}件選択中
          </p>
          <button
            onClick={handleDeleteBulk}
            disabled={isDeleting}
            className={cn(
              buttonVariants({ variant: "destructive", size: "sm" }),
              "flex items-center gap-2"
            )}
          >
            <Trash2 className="size-4" />
            選択したアイテムを削除
          </button>
        </div>
      )}

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10">
                <button onClick={toggleSelectAll} className="flex items-center justify-center">
                  {selectedIds.length === patterns.length && patterns.length > 0 ? (
                    <CheckSquare className="size-4 text-primary" />
                  ) : (
                    <Square className="size-4 text-muted-foreground" />
                  )}
                </button>
              </TableHead>
              <TableHead>パターン名</TableHead>
              <TableHead>UX目的</TableHead>
              <TableHead>認知負荷</TableHead>
              <TableHead>最終更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!patterns || patterns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  パターンがまだ登録されていません。事例を分析すると自動的に追加されます。
                </TableCell>
              </TableRow>
            ) : (
              patterns.map((item) => (
                <TableRow key={item.id} className={cn("group", selectedIds.includes(item.id) && "bg-red-50/30")}>
                  <TableCell>
                    <button onClick={() => toggleSelect(item.id)} className="flex items-center justify-center">
                      {selectedIds.includes(item.id) ? (
                        <CheckSquare className="size-4 text-primary" />
                      ) : (
                        <Square className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-bold">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.purpose || '未設定'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.cognitive_load || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.updated_at).toLocaleDateString('ja-JP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/patterns/${item.slug}`} 
                        target="_blank"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                      <Link 
                        href={`/admin/patterns/${item.id}/edit`} 
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50")}
                      >
                        <Edit3 className="size-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteSingle(item.id)}
                        disabled={isDeleting}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 text-red-600 hover:text-red-700 hover:bg-red-50")}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
