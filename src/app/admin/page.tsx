import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Trash2, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { deleteCase } from "./actions"
import { DeleteButton } from "./DeleteButton"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">事例管理</h1>
          <p className="text-muted-foreground">登録済みのUI/UX事例を管理します。</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/patterns" 
            className={cn(buttonVariants({ variant: "outline" }), "flex items-center")}
          >
            <Layers className="mr-2 size-4" />
            パターンを管理
          </Link>
          <Link 
            href="/admin/cases/new" 
            className={cn(buttonVariants({ variant: "default" }), "flex items-center")}
          >
            <Plus className="mr-2 size-4" />
            新規事例を追加
          </Link>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  事例がまだ登録されていません。
                </TableCell>
              </TableRow>
            ) : (
              cases.map((item) => (
                <TableRow key={item.id} className="group">
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
                      <DeleteButton id={item.id} />
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
