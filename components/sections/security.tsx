import { Lock, Fingerprint, ShieldWarning } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All communications and transactions are protected with end-to-end encryption, ensuring your data is safe from unauthorized access.",
  },
  {
    icon: Fingerprint,
    title: "Two-Factor Authentication (2FA)",
    description: "Enhance your account security with two-factor authentication, adding an extra layer of protection to your login process.",
  },
  {
    icon: ShieldWarning,
    title: "Fraud Detection",
    description: "Advanced fraud detection algorithms monitor transactions in real-time, identifying and preventing suspicious activities.",
  },
]

export function SecuritySection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
              Advanced Security Features
            </h2>
            <p className="mt-4 text-pretty text-lg text-white/70">
              Protecting your transactions with cutting-edge technology.
            </p>

            <div className="mt-10 space-y-6">
              {securityFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-amber-500/10 text-amber-400 shadow-md shadow-amber-400/10 ring-1 ring-amber-400/20">
                    <feature.icon size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-8 bg-amber-500 hover:bg-amber-600 text-black font-semibold" asChild>
              <Link href="/register">{"Let's Get Started"}</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400/20 via-teal-500/20 to-amber-400/10 p-3">
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/hero-handshake.png"
                  alt="Business handshake representing trust and secure transactions"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

