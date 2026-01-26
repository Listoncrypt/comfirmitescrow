import { FileText, DollarSign, Package, CheckCircle } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: FileText,
    title: "Agreement",
    description: "Both parties agree on transaction terms, including price and delivery.",
  },
  {
    step: 2,
    icon: DollarSign,
    title: "Submit Payment",
    description: "The buyer deposits the agreed funds into ESCROW, securing the payment.",
  },
  {
    step: 3,
    icon: Package,
    title: "Deliver",
    description: "The seller delivers as agreed, meeting the buyer's expectations.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Release Payment",
    description: "Upon buyer's confirmation, funds are released from ESCROW to the seller.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How Escrow Works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Simple, secure, and straightforward. Here&apos;s how Confirmdeal protects your transactions.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-6 hidden h-0.5 w-full -translate-x-0 bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
