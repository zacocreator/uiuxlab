'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteCases(ids: string[]) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cases')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Bulk delete error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

export async function updateCase(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const service_name = formData.get('service_name') as string
  const category = formData.get('category') as string
  const url = formData.get('url') as string
  const summary = formData.get('summary') as string
  const ux_notes = formData.get('ux_notes') as string
  const good_points = formData.get('good_points') as string
  const improvement_points = formData.get('improvement_points') as string
  const thumbnail_url = formData.get('thumbnail') as string
  
  const target_users = formData.get('target_users') as string
  const user_needs = formData.get('user_needs') as string
  const ux_strategy = formData.get('ux_strategy') as string
  const information_architecture = formData.get('information_architecture') as string
  const ui_tone = formData.get('ui_tone') as string
  const main_cta = formData.get('main_cta') as string
  const conversion_points = formData.get('conversion_points') as string
  const trust_elements = formData.get('trust_elements') as string
  const friction_points = formData.get('friction_points') as string
  const reusable_patterns = formData.get('reusable_patterns') as string
  const ux_positioning_raw = formData.get('ux_positioning') as string
  const ux_positioning = ux_positioning_raw ? JSON.parse(ux_positioning_raw) : []

  const tagsString = formData.get('tags') as string

  const { error } = await supabase
    .from('cases')
    .update({
      title,
      service_name,
      category,
      url,
      summary,
      ux_notes,
      good_points,
      improvement_points,
      thumbnail_url,
      target_users,
      user_needs,
      ux_strategy,
      information_architecture,
      ui_tone,
      main_cta,
      conversion_points,
      trust_elements,
      friction_points,
      reusable_patterns,
      ux_positioning,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Update case error:', error)
    return { error: error.message }
  }

  // Handle Tags Update
  // 1. Delete existing links
  await supabase
    .from('case_tags')
    .delete()
    .eq('case_id', id)

  // 2. Add new links
  if (tagsString) {
    const tagNames = tagsString.split(',').map(t => t.trim()).filter(t => t !== '')
    
    for (const name of tagNames) {
      // Upsert tag
      const { data: tagData } = await supabase
        .from('tags')
        .upsert({ name }, { onConflict: 'name' })
        .select()
        .single()

      if (tagData) {
        // Link tag to case
        await supabase
          .from('case_tags')
          .insert({
            case_id: id,
            tag_id: tagData.id
          })
      }
    }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/cases/${id}`)
  
  return { success: true }
}
