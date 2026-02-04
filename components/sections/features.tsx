"use client"

import { CreditCard, Scales, Bell, Globe } from "@phosphor-icons/react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  {
    icon: CreditCard,
    title: "Secure Payment Handling",
    description:
      "Our platform ensures that all transactions are processed through a robust and secure payment system. Funds are held in escrow until both parties fulfill their obligations, significantly reducing the risk of fraud or non-payment.",
    highlight: "Bank-grade encryption",
  },
  {
    icon: Scales,
    title: "Easy Dispute Resolution",
    description:
      "We offer a streamlined dispute resolution process designed to resolve conflicts quickly and fairly. Our dedicated support team reviews each case and mediates to reach an impartial outcome.",
    highlight: "24/7 support team",
  },
  {
    icon: Bell,
    title: "Real Time Notifications",
    description:
      "Stay informed at every stage of your transaction with our real-time notification system. Receive instant updates via email, SMS, or in-app alerts whenever there is a change in transaction status.",
    highlight: "Multi-channel alerts",
  },
  {
    icon: Globe,
    title: "Multicurrency Support",
    description:
      "Our platform supports transactions in multiple currencies, making it accessible to users worldwide. The system seamlessly handles currency conversions and displays real-time exchange rates.",
    highlight: "NGN, USD, GBP & more",
  },
]

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section id="features" ref={ref} className="relative py-20 lg:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)] opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--accent)_0%,transparent_50%)] opacity-5" />
      </div>

      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Platform Features
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need for Secure Transactions
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Discover what makes Confirmdeal the most trusted escrow platform in Nigeria.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group flex flex-col gap-6 overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 md:flex-row md:items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 text-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20">
                <feature.icon size={48} weight="duotone" />
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 transition-all duration-500 group-hover:ring-primary/20" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {feature.highlight}
                  </span>
                </div>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

