"use client"

import { ShieldWarning, Lightning, CheckCircle, Warning } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const benefits = [
  {
    icon: Warning,
    title: "Dispute Prevention",
    description: "Clear, transparent processes help prevent disputes before they arise, ensuring smoother transactions.",
  },
  {
    icon: Lightning,
    title: "Enhanced Flexibility",
    description: "Our platform adapts to your needs, offering flexible payment options and customizable transaction terms.",
  },
  {
    icon: CheckCircle,
    title: "Simplified Transactions",
    description: "Our platform makes it easy to set up and manage transactions, reducing the time and effort needed.",
  },
  {
    icon: ShieldWarning,
    title: "Reduced Risk",
    description: "Protect yourself from fraud and ensure that both parties meet their obligations before funds are released.",
  },
]

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section id="about" ref={ref} className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Why Choose Us
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Benefits of CONFIRMEDIT
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Experience secure and hassle-free transactions with our trusted escrow platform.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-accent/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-accent/5" />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary shadow-md shadow-primary/10 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:via-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:ring-primary/50">
                <benefit.icon size={28} weight="duotone" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 text-center transition-all delay-700 duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <Button size="lg" className="shadow-lg shadow-primary/25" asChild>
            <Link href="/register">{"Let's Get Started"}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


