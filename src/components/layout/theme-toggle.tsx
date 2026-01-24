import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div>Logo</div>
        
        <nav className="flex items-center gap-6">
          <a href="/#hero">Ana Sayfa</a>
          <a href="/#projeler">Projeler</a>
          
          {/* Dark mode toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}