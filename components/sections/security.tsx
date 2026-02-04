"use client"

import { Lock, Fingerprint, ShieldWarning, ShieldCheck, Eye, Database } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All communications and transactions are protected with end-to-end encryption, ensuring your data is safe.",
  },
  {
    icon: Fingerprint,
    title: "Two-Factor Authentication",
    description: "Enhance your account security with 2FA, adding an extra layer of protection to your login process.",
  },
  {
    icon: ShieldWarning,
    title: "Fraud Detection",
    description: "Advanced algorithms monitor transactions in real-time, identifying and preventing suspicious activities.",
  },
  {
    icon: Eye,
    title: "Transaction Monitoring",
    description: "24/7 monitoring of all transactions to ensure compliance and detect any anomalies instantly.",
  },
  {
    icon: Database,
    title: "Secure Data Storage",
    description: "Your data is stored in secure, redundant data centers with regular backups and disaster recovery.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Compliance",
    description: "We comply with all relevant financial regulations and data protection laws to keep you safe.",
  },
]

export function SecuritySection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section ref={ref} className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div
            className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Bank-Grade Security
            </span>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Your Security is Our Priority
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              We employ multiple layers of security to protect your transactions and personal information.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex gap-3 rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon size={20} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-8 shadow-lg shadow-primary/25" asChild>
              <Link href="/register">Start Secure Trading</Link>
            </Button>
          </div>

          {/* Right content - Image */}
          <div
            className={`relative transition-all delay-300 duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-4">
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/hero-handshake.png"
                  alt="Business handshake representing trust and secure transactions"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 rounded-xl border border-border/50 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                    <ShieldCheck size={16} weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">100% Protected</p>
                    <p className="text-[10px] text-muted-foreground">All transactions insured</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 rounded-xl border border-border/50 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Lock size={16} weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">256-bit SSL</p>
                    <p className="text-[10px] text-muted-foreground">Bank-level encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

