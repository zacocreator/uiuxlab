import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import EditCaseForm from "./EditCaseForm"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditCasePage({ params }: PageProps) {
  const { id } = params
  const supabase = await createClient()

  // Fetch case data
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select(`
      *,
      tags:case_tags(
        tag:tags(name)
      )
    `)
    .eq('id', id)
    .single()

  if (caseError || !caseData) {
    console.error('Fetch case error:', caseError)
    return notFound()
  }

  // Format tags as comma-separated string
  const formattedTags = caseData.tags
    ?.map((t: any) => t.tag?.name)
    .filter(Boolean)
    .join(', ')

  const initialData = {
    ...caseData,
    tags: formattedTags
  }

  return <EditCaseForm initialData={initialData} />
}
