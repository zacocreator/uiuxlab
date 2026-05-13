import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutTemplate, Layers, AlertTriangle, Lightbulb, Smartphone, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PatternVisualizer from "@/components/patterns/PatternVisualizer";

export default async function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch pattern details
  const { data: pattern, error } = await supabase
    .from('patterns')
    .select(`
      *,
      case_patterns(
        cases(id, title, service_name, category, thumbnail_url, summary)
      )
    `)
    .eq('slug', resolvedParams.slug)
    .single()

  if (error || !pattern) {
    notFound()
  }

  const relatedCases = pattern.case_patterns
    ?.map((cp: any) => cp.cases)
    .filter(Boolean) || []

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link 
        href="/patterns" 
        className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-8 transition-colors w-fit"
      >
        <ArrowLeft className="mr-2 size-4" />
        パターンライブラリに戻る
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Layers className="size-6" />
          </div>
          {pattern.purpose && <Badge variant="secondary">{pattern.purpose}</Badge>}
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{pattern.name}</h1>
        
        <div className="text-xl text-muted-foreground leading-relaxed">
          {pattern.short_description}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-16">
        <div className="md:col-span-2 space-y-10">
          {/* Core Analysis */}
          <section className="space-y-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-3">
                <AlertTriangle className="size-5 text-amber-500" />
                解決するユーザー課題
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{pattern.user_problem || '未設定'}</p>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-3">
                <Lightbulb className="size-5 text-blue-500" />
                UX的効果
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{pattern.ux_effect || '未設定'}</p>
            </div>

            {(pattern.best_for || pattern.risks) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {pattern.best_for && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">向いているケース</h3>
                    <p className="text-sm text-muted-foreground">{pattern.best_for}</p>
                  </div>
                )}
                {pattern.risks && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">注意点・リスク</h3>
                    <p className="text-sm text-muted-foreground">{pattern.risks}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Implementation Notes */}
          {pattern.implementation_notes && (
            <section>
              <h2 className="text-2xl font-bold mb-4">実装メモ</h2>
              <div className="bg-muted/30 border rounded-xl p-6 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {pattern.implementation_notes}
              </div>
            </section>
          )}

          {/* UX Positioning */}
          {pattern.ux_positioning && pattern.ux_positioning.length > 0 && (
            <section className="bg-muted/30 p-6 rounded-xl border border-border">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                UX Positioning
              </h2>
              <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {pattern.ux_positioning.map((pos: any) => (
                  <div key={pos.axis} className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      <span className={pos.score < 40 ? "text-primary" : ""}>{pos.label_left}</span>
                      <span className={pos.score > 60 ? "text-primary" : ""}>{pos.label_right}</span>
                    </div>
                    <div className="relative h-1 bg-border rounded-full">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000"
                        style={{ left: `${pos.score}%`, transform: 'translate(-50%, -50%)' }}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-border left-1/2 -translate-x-1/2" />
                    </div>
                    {pos.comment && (
                      <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20">
                        {pos.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pattern Visualization */}
          {pattern.visualization_data && Object.keys(pattern.visualization_data).length > 0 && (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <LayoutTemplate className="size-6 text-indigo-500" />
                Pattern Visualization
              </h2>
              <PatternVisualizer data={pattern.visualization_data} />
            </section>
          )}
        </div>

        {/* Sidebar Metadata */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-5 space-y-6">
            <h3 className="font-bold border-b pb-2">メタデータ</h3>
            
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">認知負荷</div>
              <div className="text-sm">{pattern.cognitive_load || '不明'}</div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">感情的効果</div>
              <div className="text-sm">{pattern.emotional_effect || '不明'}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <Smartphone className="size-3" />
                モバイル適性
              </div>
              <div className="text-sm">{pattern.mobile_compatibility || '不明'}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <ShieldCheck className="size-3" />
                アクセシビリティ観点
              </div>
              <div className="text-sm">{pattern.accessibility_notes || '不明'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Used in Cases Section */}
      <section className="border-t pt-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <LayoutTemplate className="size-6 text-primary" />
          使用しているサービス
        </h2>
        <p className="text-muted-foreground mb-8">
          このパターンは以下のサービス事例で抽出されています。
        </p>

        {relatedCases.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCases.map((c: any) => (
              <Link href={`/cases/${c.id}`} key={c.id} className="group block">
                <div className="bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col h-full">
                  {c.thumbnail_url ? (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={c.thumbnail_url} 
                        alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                      <LayoutTemplate className="size-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-xs text-muted-foreground mb-1">{c.service_name}</div>
                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2 mb-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">{c.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-xl p-10 text-center border border-dashed">
            <p className="text-muted-foreground">関連する事例がまだありません。</p>
          </div>
        )}
      </section>
    </div>
  )
}
