import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tighter">UI/UX LAB</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Gallery
            </Link>
            <Link
              href="/patterns"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Patterns
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button 
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
