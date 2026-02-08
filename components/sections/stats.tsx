"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useEffect, useState } from "react"

const stats = [
  { value: 50000, suffix: "+", label: "Total Transactions", prefix: "" },
  { value: 2.5, suffix: "B+", label: "NGN Secured", prefix: "₦" },
  { value: 35000, suffix: "+", label: "Active Users", prefix: "" },
  { value: 99.9, suffix: "%", label: "Success Rate", prefix: "" },
]

function AnimatedCounter({
  value,
  suffix,
  prefix,
  isVisible,
}: {
  value: number
  suffix: string
  prefix: string
  isVisible: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(value, increment * step)
      setCount(current)

      if (step >= steps) {
        clearInterval(timer)
        setCount(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  const formatNumber = (num: number) => {
    if (num >= 1000 && num < 1000000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K"
    }
    if (num < 10) {
      return num.toFixed(1)
    }
    return Math.round(num).toLocaleString()
  }

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section ref={ref} className="relative py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by Thousands Across Nigeria
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Join the growing community of buyers and sellers who trust CONFIRMEDIT for secure transactions.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-8 text-center backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 transition-all duration-500 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-transparent" />

              <div className="text-4xl font-bold text-foreground lg:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isVisible={isVisible}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


