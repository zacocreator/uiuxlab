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
import { Plus, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import CaseTable from "./CaseTable"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: cases } = await supabase
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

      <CaseTable cases={cases || []} />
    </div>
  )
}
