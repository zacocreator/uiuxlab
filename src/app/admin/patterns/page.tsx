import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { buttonVariants } from "@/components/ui/button-variants";
import { Layers, Edit3, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import PatternTable from "./PatternTable";

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

      <PatternTable patterns={patterns || []} />
    </div>
  )
}
