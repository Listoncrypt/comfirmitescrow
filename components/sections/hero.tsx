"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star, ArrowRight, ShieldCheck, Clock, Users } from "@phosphor-icons/react"
import { useState, useEffect } from "react"

const headlines = [
  { text: "Secure Every Deal", highlight: "with Confidence" },
  { text: "Avoid Getting", highlight: "Scammed" },
  { text: "Trade Without", highlight: "Fear" },
  { text: "Your Money is", highlight: "Protected" },
]

const categories = [
  { value: "real-estate", label: "Real Estate" },
  { value: "vehicles", label: "Vehicles" },
  { value: "gadgets", label: "Gadgets" },
  { value: "clothes", label: "Clothes" },
  { value: "hair", label: "Hair" },
  { value: "online-subscriptions", label: "Online Subscriptions" },
  { value: "visa-processing", label: "Visa Processing" },
  { value: "services", label: "Services" },
  { value: "construction", label: "Construction" },
  { value: "others", label: "Others" },
]

const miniStats = [
  { icon: ShieldCheck, label: "100% Secure", value: "Bank-grade" },
  { icon: Clock, label: "Fast Release", value: "24-48hrs" },
  { icon: Users, label: "Active Users", value: "35K+" },
]

export function HeroSection() {
  const [role, setRole] = useState("buying")
  const [feeCharge, setFeeCharge] = useState("buyer")
  const [currentHeadline, setCurrentHeadline] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    return Number(numericValue).toLocaleString("en-NG")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value)
    setAmount(formatted)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentHeadline((prev) => (prev + 1) % headlines.length)
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen overflow-hidden py-20 lg:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-60 -top-60 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div className="max-w-xl animate-blur-in">
            {/* Trust badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-card/80 px-4 py-2 shadow-lg shadow-primary/5 backdrop-blur-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} weight="fill" className="text-primary" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">4.8</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">From 1,500+ reviews</span>
            </div>

            {/* Headline */}
            <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="relative block overflow-hidden">
                <span
                  className={`inline-block transition-all duration-500 ease-out ${
                    isAnimating ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  {headlines[currentHeadline].text}{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      {headlines[currentHeadline].highlight}
                    </span>
                    <span
                      className={`absolute bottom-2 left-0 -z-0 h-3 rounded-full bg-primary/20 transition-all duration-700 ease-out ${
                        isAnimating ? "w-0" : "w-full"
                      }`}
                    />
                  </span>
                </span>
              </span>
            </h1>

            {/* Progress indicators */}
            <div className="mt-6 flex gap-2">
              {headlines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true)
                    setTimeout(() => {
                      setCurrentHeadline(index)
                      setIsAnimating(false)
                    }, 500)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentHeadline
                      ? "w-10 bg-gradient-to-r from-primary to-accent"
                      : "w-4 bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to headline ${index + 1}`}
                />
              ))}
            </div>

            {/* Description */}
            <p className="mt-8 text-pretty text-lg leading-relaxed text-muted-foreground">
              Confirmdeal provides a trusted escrow platform that protects both buyers and sellers.
              Experience secure transactions with transparent processes and complete peace of mind.
            </p>

            {/* Mini stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              {miniStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <stat.icon size={20} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Deal form */}
          <div className="w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="animate-scale-in animation-delay-200 rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur-md">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Start a Secure Deal</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your escrow transaction in seconds</p>
              </div>

              <div className="mb-6">
                <RadioGroup defaultValue="buying" className="flex gap-2" onValueChange={setRole}>
                  <div className="flex-1">
                    <RadioGroupItem value="selling" id="selling" className="peer sr-only" />
                    <Label
                      htmlFor="selling"
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                        role === "selling"
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      {"I'm Selling"}
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="buying" id="buying" className="peer sr-only" />
                    <Label
                      htmlFor="buying"
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                        role === "buying"
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      {"I'm Buying"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
                    Transaction Category
                  </Label>
                  <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger id="category" className="h-12 rounded-xl bg-background/50">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-foreground">
                    Who pays the escrow fee?
                  </Label>
                  <RadioGroup defaultValue="buyer" className="flex gap-3" onValueChange={setFeeCharge}>
                    {[
                      { value: "buyer", label: "Buyer" },
                      { value: "seller", label: "Seller" },
                      { value: "split", label: "50/50" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`fee-${option.value}`} />
                        <Label htmlFor={`fee-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="amount" className="mb-2 block text-sm font-medium text-foreground">
                    Transaction Amount
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={handleAmountChange}
                      className="h-14 rounded-xl bg-background/50 pl-10 text-xl font-semibold"
                    />
                  </div>
                </div>

                <Button
                  className="mt-2 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                  size="lg"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem(
                        "comfirmit_pending_deal",
                        JSON.stringify({
                          role: role === "selling" ? "seller" : "buyer",
                          amount: amount.replace(/,/g, ""),
                          category,
                          feeCharge,
                        })
                      )
                      window.location.href = "/register"
                    }
                  }}
                >
                  Start Secure Escrow
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Protected by bank-grade security. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
