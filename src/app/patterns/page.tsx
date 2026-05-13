import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Component, Layers } from "lucide-react"

export default async function PatternsPage() {
  const supabase = await createClient()

  const { data: patterns, error } = await supabase
    .from('patterns')
    .select(`
      *,
      case_patterns(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching patterns:', error)
  }

  // Extract unique purposes for potential filtering later
  const purposes = Array.from(new Set(patterns?.map(p => p.purpose).filter(Boolean)))

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Layers className="size-8 text-primary" />
            Pattern Library
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            サービスから抽出された再利用可能なUX/UIパターンのナレッジベースです。
            認知負荷、感情的効果、アクセシビリティなどの観点からパターンを分析・整理しています。
          </p>
        </div>
      </div>

      {purposes.length > 0 && (
        <div className="mb-8 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary text-primary-foreground">
            All
          </Badge>
          {purposes.map(purpose => (
            <Badge key={purpose} variant="outline" className="px-3 py-1 text-sm cursor-pointer hover:bg-secondary">
              {purpose}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns?.map((pattern) => {
          const caseCount = pattern.case_patterns?.[0]?.count || 0
          return (
            <Link href={`/patterns/${pattern.slug}`} key={pattern.id} className="block group h-full">
              <div className="border border-border bg-card rounded-xl p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Component className="size-5" />
                  </div>
                  {caseCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {caseCount} Cases
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {pattern.name}
                </h2>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                  {pattern.short_description}
                </p>
                
                <div className="pt-4 border-t flex flex-wrap gap-2 mt-auto">
                  {pattern.purpose && (
                    <span className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md">
                      {pattern.purpose}
                    </span>
                  )}
                  {pattern.cognitive_load && (
                    <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-md flex items-center gap-1">
                      負荷: {pattern.cognitive_load}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {patterns?.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <Component className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">パターンがまだありません</h3>
          <p className="text-muted-foreground">
            事例を登録して、AIにUI/UXパターンを抽出させてください。
          </p>
        </div>
      )}
    </div>
  )
}
