import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditPatternForm from "../../EditPatternForm";

export default async function EditPatternPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: pattern, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !pattern) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link 
        href="/admin/patterns" 
        className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-8 transition-colors w-fit"
      >
        <ArrowLeft className="mr-2 size-4" />
        パターン管理に戻る
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold">パターンの編集</h1>
        <p className="text-muted-foreground mt-2">
          AIが抽出したパターン情報を修正し、ナレッジを洗練させます。
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <EditPatternForm pattern={pattern} />
      </div>
    </div>
  )
}
