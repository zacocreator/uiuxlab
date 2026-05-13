'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCase(formData: FormData) {
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
  const tagsString = formData.get('tags') as string
  
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
  
  const extracted_patterns_raw = formData.get('extracted_patterns') as string
  const extracted_patterns = extracted_patterns_raw ? JSON.parse(extracted_patterns_raw) : []

  // 1. Insert Case
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .insert({
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
      analyzed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (caseError) {
    console.error('Case insert error:', caseError)
    return
  }

  // 2. Handle Tags
  if (tagsString) {
    const tagNames = tagsString.split(',').map(t => t.trim()).filter(t => t !== '')
    
    for (const name of tagNames) {
      // Upsert tag
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({ name }, { onConflict: 'name' })
        .select()
        .single()

      if (tagData) {
        // Link tag to case
        await supabase
          .from('case_tags')
          .insert({
            case_id: caseData.id,
            tag_id: tagData.id
          })
      }
    }
  }

  // 3. Handle Patterns
  if (extracted_patterns && extracted_patterns.length > 0) {
    for (const pattern of extracted_patterns) {
      // Create slug from name
      const slug = pattern.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `pattern-${Date.now()}`
      
      const { data: patternData, error: patternError } = await supabase
        .from('patterns')
        .upsert({ 
          name: pattern.name,
          slug: slug,
          short_description: pattern.short_description,
          purpose: pattern.purpose,
          user_problem: pattern.user_problem,
          ux_effect: pattern.ux_effect,
          implementation_notes: pattern.implementation_notes,
          best_for: pattern.best_for,
          risks: pattern.risks,
          cognitive_load: pattern.cognitive_load,
          emotional_effect: pattern.emotional_effect,
          mobile_compatibility: pattern.mobile_compatibility,
          accessibility_notes: pattern.accessibility_notes,
          ux_positioning: pattern.ux_positioning,
          visualization_data: pattern.visualization_data
        }, { onConflict: 'name' })
        .select()
        .single()

      if (patternError) {
        console.error('Pattern upsert error:', patternError)
      } else if (patternData) {
        // Link pattern to case
        await supabase
          .from('case_patterns')
          .insert({
            case_id: caseData.id,
            pattern_id: patternData.id
          })
      }
    }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/admin')
}
