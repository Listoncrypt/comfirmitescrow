"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ShieldCheck, Lock, CurrencyDollar, Globe } from "@phosphor-icons/react"

const badges = [
  { icon: ShieldCheck, label: "SSL Secured" },
  { icon: Lock, label: "256-bit Encryption" },
  { icon: CurrencyDollar, label: "Licensed & Regulated" },
  { icon: Globe, label: "Multi-Currency Support" },
]

export function TrustBadgesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative border-y border-border/50 bg-muted/30 py-8 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className={`flex items-center gap-3 transition-all duration-700 ${isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <badge.icon size={20} weight="duotone" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


