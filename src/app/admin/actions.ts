'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteCase(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()

  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error)
    return
  }

  revalidatePath('/admin')
  revalidatePath('/')
}
