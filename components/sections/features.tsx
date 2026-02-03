import { CreditCard, Scale, Bell, Globe } from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "Secure Payment Handling",
    description: "Our platform ensures that all transactions are processed through a robust and secure payment system. Funds are held in escrow until both parties fulfill their obligations, significantly reducing the risk of fraud or non-payment. Advanced encryption and compliance with industry standards protect sensitive financial information at every step.",
  },
  {
    icon: Scale,
    title: "Easy Dispute Resolution",
    description: "We offer a streamlined dispute resolution process designed to resolve conflicts quickly and fairly. If any disagreement arises during a transaction, users can initiate a dispute within the platform. Our dedicated support team reviews the case, gathers relevant evidence, and mediates to reach an impartial outcome.",
  },
  {
    icon: Bell,
    title: "Real Time Notifications",
    description: "Stay informed at every stage of your transaction with our real-time notification system. Users receive instant updates via email, SMS, or in-app alerts whenever there is a change in transaction status, such as payment confirmation, document submission, or dispute initiation.",
  },
  {
    icon: Globe,
    title: "Multicurrency Support",
    description: "Our platform supports transactions in multiple currencies, making it accessible to users worldwide. Whether you are dealing in USD, EUR, GBP, or other major currencies, the system seamlessly handles currency conversions and displays real-time exchange rates.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Features
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Discover what makes Confirmdeal the most trusted escrow platform.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 text-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20">
                <feature.icon className="h-10 w-10 stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
