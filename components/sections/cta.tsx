"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock, CurrencyDollar } from "@phosphor-icons/react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const benefits = [
  { icon: ShieldCheck, text: "100% Secure Transactions" },
  { icon: Clock, text: "24-48hr Fund Release" },
  { icon: CurrencyDollar, text: "No Hidden Fees" },
]

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent px-8 py-16 text-center shadow-2xl shadow-primary/25 lg:px-16 lg:py-24 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
          </div>

          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            Ready to Secure Your Next Transaction?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-primary-foreground/80">
            Join thousands of satisfied users who trust Confirmdeal for their escrow needs. Start your first secure
            transaction today.
          </p>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-2 text-primary-foreground/90">
                <benefit.icon size={20} weight="fill" />
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-base font-semibold shadow-lg"
              asChild
            >
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-primary-foreground/30 bg-transparent px-8 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

