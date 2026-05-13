import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"
import { cn } from "@/lib/utils"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('cases')
    .select(`
      *,
      case_tags (
        tags (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Filters
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,service_name.ilike.%${params.q}%,summary.ilike.%${params.q}%`)
  }
  if (params.category && params.category !== 'All') {
    query = query.eq('category', params.category)
  }

  const { data: cases, error } = await query

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16 mx-auto max-w-7xl">
      <div className="mb-12 space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          UI/UX Gallery
        </h1>
        <p className="text-lg text-muted-foreground max-w-[800px]">
          個人的に収集した優れたUIデザインやUXの事例を集めたナレッジベースです。
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          <Link href="/" className={cn(badgeVariants({ variant: !params.category || params.category === 'All' ? "secondary" : "outline" }), "px-5 py-1.5")}>
            All
          </Link>
          <Link href="/?category=Web App" className={cn(badgeVariants({ variant: params.category === 'Web App' ? "secondary" : "outline" }), "px-5 py-1.5")}>
            Web App
          </Link>
          <Link href="/?category=Mobile App" className={cn(badgeVariants({ variant: params.category === 'Mobile App' ? "secondary" : "outline" }), "px-5 py-1.5")}>
            Mobile App
          </Link>
        </div>
      </div>

      {!cases || cases.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-muted/10">
          <p className="text-muted-foreground">事例がまだ登録されていません。</p>
          <Link href="/admin/cases/new" className="text-primary hover:underline mt-2 inline-block">
            管理画面から追加する
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <Link href={`/cases/${item.id}`} key={item.id} className="block group">
              <Card className="h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
                <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                  {item.thumbnail_url ? (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{item.service_name}</span>
                    <Badge variant="secondary" className="text-[10px] font-bold">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.case_tags?.map((ct: any) => (
                      <Badge key={ct.tags.name} variant="outline" className="text-[10px] font-medium px-2 bg-background/30">
                        {ct.tags.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to use badge styles in Link
function badgeVariants({ variant }: { variant: "secondary" | "outline" }) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variants = {
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground hover:bg-secondary/50"
  }
  return variants[variant] ? cn(base, variants[variant]) : base
}
