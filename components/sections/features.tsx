import { CreditCard, Scales, Bell, Globe } from "@phosphor-icons/react/dist/ssr"

const features = [
  {
    icon: CreditCard,
    title: "Secure Payment Handling",
    description: "Our platform ensures that all transactions are processed through a robust and secure payment system. Funds are held in escrow until both parties fulfill their obligations, significantly reducing the risk of fraud or non-payment. Advanced encryption and compliance with industry standards protect sensitive financial information at every step.",
  },
  {
    icon: Scales,
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
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Our Features
          </h2>
          <p className="mt-4 text-pretty text-lg text-white/70">
            Discover what makes Confirmdeal the most trusted escrow platform.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:flex-row md:items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-amber-500/10 text-amber-400 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/20">
                <feature.icon size={40} weight="duotone" />
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-white/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

