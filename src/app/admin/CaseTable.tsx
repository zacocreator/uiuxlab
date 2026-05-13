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
import { deleteCases } from "./actions"

interface Case {
  id: string
  title: string
  service_name: string
  category: string
  created_at: string
}

export default function CaseTable({ cases }: { cases: Case[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === cases.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(cases.map(c => c.id))
    }
  }

  const handleDeleteBulk = async () => {
    if (!confirm(`${selectedIds.length}件の事例を削除してもよろしいですか？`)) return
    
    setIsDeleting(true)
    const res = await deleteCases(selectedIds)
    if (res?.error) {
      alert('削除に失敗しました: ' + res.error)
    } else {
      setSelectedIds([])
    }
    setIsDeleting(false)
  }

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('この事例を削除してもよろしいですか？')) return
    
    setIsDeleting(true)
    const res = await deleteCases([id])
    if (res?.error) {
      alert('削除に失敗しました: ' + res.error)
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
                  {selectedIds.length === cases.length && cases.length > 0 ? (
                    <CheckSquare className="size-4 text-primary" />
                  ) : (
                    <Square className="size-4 text-muted-foreground" />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">カテゴリー</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>サービス名</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!cases || cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  事例がまだ登録されていません。
                </TableCell>
              </TableRow>
            ) : (
              cases.map((item) => (
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
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold whitespace-nowrap">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.service_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.created_at).toLocaleDateString('ja-JP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/cases/${item.id}`} 
                        target="_blank"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                      <Link 
                        href={`/admin/cases/${item.id}/edit`} 
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
