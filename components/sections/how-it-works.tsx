"use client"

import { FileText, CurrencyDollar, Package, CheckCircle, ArrowRight } from "@phosphor-icons/react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const steps = [
  {
    step: 1,
    icon: FileText,
    title: "Agreement",
    description: "Both parties agree on transaction terms, including price, inspection period, and delivery timeline.",
  },
  {
    step: 2,
    icon: CurrencyDollar,
    title: "Submit Payment",
    description: "The buyer deposits the agreed funds into our secure escrow account, protecting both parties.",
  },
  {
    step: 3,
    icon: Package,
    title: "Deliver",
    description: "The seller delivers as agreed. Buyer has an inspection period to verify the goods or services.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Release Payment",
    description: "Upon buyer's confirmation, funds are released from escrow to the seller's balance.",
  },
]

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section id="how-it-works" ref={ref} className="relative py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Simple Process
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How Escrow Works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Simple, secure, and straightforward. Here&apos;s how Confirmdeal protects your transactions.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection line - desktop */}
          <div className="absolute left-0 right-0 top-[72px] hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background">
                      {step.step}
                    </div>
                    {/* Arrow to next step - desktop */}
                    {index < steps.length - 1 && (
                      <div className="absolute -right-[calc(50%+16px)] top-1/2 hidden -translate-y-1/2 lg:block">
                        <ArrowRight size={20} className="text-primary/40" />
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-card/80 text-primary shadow-md ring-1 ring-border/50 backdrop-blur-sm">
                    <step.icon size={28} weight="duotone" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

