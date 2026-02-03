"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
    setIsOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "border-b border-amber-400/20 bg-[#1a3a3a]/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-[#1a3a3a]/80"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Confirmdeal Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-white">Confirmdeal</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${activeSection === item.href.replace("#", "")
                ? "text-amber-400"
                : "text-white/70 hover:text-white"
                }`}
            >
              {item.label}
              {activeSection === item.href.replace("#", "") && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-300" />
              )}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="mb-8 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Confirmdeal Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-foreground">Confirmdeal</span>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`rounded-lg px-4 py-3 text-lg font-medium transition-all ${activeSection === item.href.replace("#", "")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button variant="outline" asChild className="h-12 bg-transparent">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="h-12">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
