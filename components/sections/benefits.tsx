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
            Benefits of Confirmit
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
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
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
