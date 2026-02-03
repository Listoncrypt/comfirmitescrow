import { Shield, Zap, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const benefits = [
  {
    icon: AlertTriangle,
    title: "Dispute Prevention",
    description: "Clear, transparent processes help prevent disputes before they arise, ensuring smoother transactions.",
  },
  {
    icon: Zap,
    title: "Enhanced Flexibility",
    description: "Our platform adapts to your needs, offering flexible payment options and customizable transaction terms.",
  },
  {
    icon: CheckCircle,
    title: "Simplified Transactions",
    description: "Our platform makes it easy to set up and manage transactions, reducing the time and effort needed.",
  },
  {
    icon: Shield,
    title: "Reduced Risk",
    description: "Protect yourself from fraud and ensure that both parties meet their obligations before funds are released.",
  },
]

export function BenefitsSection() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Benefits of Confirmdeal
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Experience secure and hassle-free transactions with our trusted escrow platform.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary shadow-md shadow-primary/10 ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:via-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:ring-primary/50">
                <benefit.icon className="h-7 w-7 stroke-[1.5]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/register">{"Let's Get Started"}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
