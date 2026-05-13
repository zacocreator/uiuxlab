'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePattern(id: string, formData: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('patterns')
    .update({
      name: formData.name,
      slug: formData.slug,
      short_description: formData.short_description,
      purpose: formData.purpose,
      user_problem: formData.user_problem,
      ux_effect: formData.ux_effect,
      implementation_notes: formData.implementation_notes,
      best_for: formData.best_for,
      risks: formData.risks,
      cognitive_load: formData.cognitive_load,
      emotional_effect: formData.emotional_effect,
      mobile_compatibility: formData.mobile_compatibility,
      accessibility_notes: formData.accessibility_notes,
      visualization_data: formData.visualization_data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Update pattern error:', error)
    return { error: error.message }
  }

  revalidatePath('/patterns')
  revalidatePath(`/patterns/${formData.slug}`)
  revalidatePath('/admin/patterns')
  
  return { success: true }
}

export async function deletePattern(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('patterns')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/patterns')
  revalidatePath('/admin/patterns')
  return { success: true }
}

export async function deletePatterns(ids: string[]) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('patterns')
    .delete()
    .in('id', ids)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/patterns')
  revalidatePath('/admin/patterns')
  return { success: true }
}
