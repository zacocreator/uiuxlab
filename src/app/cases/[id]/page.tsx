import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch case details
  const { data: caseData, error } = await supabase
    .from('cases')
    .select(`
      *,
      case_tags(
        tags(name)
      ),
      case_patterns(
        patterns(*)
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !caseData) {
    notFound()
  }

  const tags = caseData.case_tags?.map((ct: any) => ct.tags?.name).filter(Boolean) || []

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link 
        href="/" 
        className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-6 transition-colors w-fit"
      >
        <ArrowLeft className="mr-2 size-4" />
        ギャラリーに戻る
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{caseData.category}</Badge>
          <span className="text-sm text-muted-foreground">{caseData.service_name}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{caseData.title}</h1>
        {caseData.url && (
          <Button variant="outline" asChild className="mb-6">
            <a href={caseData.url} target="_blank" rel="noopener noreferrer">
              サイトを見る <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        )}
      </div>

      {caseData.thumbnail_url && (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-border mb-10">
          <img 
            src={caseData.thumbnail_url} 
            alt={caseData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-10">
        {tags.map((tag: string) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">概要</h2>
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {caseData.summary}
          </div>
        </section>

        {caseData.analyzed_at && (
          <section className="bg-muted/30 p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-primary">AI</span> UX Analysis
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {caseData.target_users && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">ターゲットユーザー</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.target_users}</p>
                </div>
              )}
              {caseData.user_needs && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">ユーザーの課題・ニーズ</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.user_needs}</p>
                </div>
              )}
              {caseData.ux_strategy && (
                <div className="sm:col-span-2">
                  <h3 className="font-semibold text-foreground mb-2">UX戦略・アプローチ</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.ux_strategy}</p>
                </div>
              )}
              {caseData.information_architecture && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">情報設計 (IA)</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.information_architecture}</p>
                </div>
              )}
              {caseData.ui_tone && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">UIトーン・世界観</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.ui_tone}</p>
                </div>
              )}
              {caseData.main_cta && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">主要なCTA</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.main_cta}</p>
                </div>
              )}
              {caseData.conversion_points && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">コンバージョンポイント</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.conversion_points}</p>
                </div>
              )}
              {caseData.trust_elements && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">信頼性構築の要素</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.trust_elements}</p>
                </div>
              )}
              {caseData.friction_points && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">フリクション (懸念点)</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.friction_points}</p>
                </div>
              )}
              {caseData.reusable_patterns && (
                <div className="sm:col-span-2">
                  <h3 className="font-semibold text-foreground mb-2">再利用可能なパターン</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{caseData.reusable_patterns}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {caseData.case_patterns && caseData.case_patterns.length > 0 && (
          <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-primary">Extracted</span> Patterns
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {caseData.case_patterns.map((cp: any) => {
                const p = cp.patterns
                if (!p) return null
                return (
                  <Link href={`/patterns/${p.slug}`} key={p.id} className="block group">
                    <div className="border border-border/50 bg-background rounded-lg p-5 space-y-3 transition-all hover:border-primary/50 hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{p.name}</h3>
                        <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                      {p.purpose && (
                        <div className="pt-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{p.purpose}</Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {caseData.ux_positioning && caseData.ux_positioning.length > 0 && (
          <section className="bg-muted/30 p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              UX Positioning
            </h2>
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {caseData.ux_positioning.map((pos: any) => (
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

        {caseData.good_points && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">良い点</h2>
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {caseData.good_points}
            </div>
          </section>
        )}

        {caseData.improvement_points && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">改善余地</h2>
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {caseData.improvement_points}
            </div>
          </section>
        )}

        {caseData.ux_notes && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">その他 UX観点メモ</h2>
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {caseData.ux_notes}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
