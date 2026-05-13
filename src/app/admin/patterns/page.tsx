import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { buttonVariants } from "@/components/ui/button-variants";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Layers, Edit3, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminPatternsPage() {
  const supabase = await createClient()
  
  const { data: patterns, error } = await supabase
    .from('patterns')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layers className="size-8 text-primary" />
            パターン管理
          </h1>
          <p className="text-muted-foreground">Pattern Libraryの情報を編集・管理します。</p>
        </div>
        <Link 
          href="/admin" 
          className={cn(buttonVariants({ variant: "outline" }), "flex items-center")}
        >
          事例管理へ戻る
        </Link>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  パターンがまだ登録されていません。事例を分析すると自動的に追加されます。
                </TableCell>
              </TableRow>
            ) : (
              patterns.map((item) => (
                <TableRow key={item.id} className="group">
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
