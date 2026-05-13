'use client'

import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import { deleteCase } from "./actions"

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteCase}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 text-destructive hover:text-destructive hover:bg-destructive/10")}
        onClick={(e) => {
          if (!confirm('本当に削除しますか？')) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  )
}
