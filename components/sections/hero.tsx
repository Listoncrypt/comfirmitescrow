"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star, Users, Globe, ArrowRight } from "lucide-react"
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
  { value: "services", label: "Services" },
  { value: "construction", label: "Construction" },
  { value: "others", label: "Others" },
]

const stats = [
  { value: "50K+", label: "Total Transactions", icon: ArrowRight },
  { value: "120+", label: "Countries", icon: Globe },
  { value: "35K+", label: "Active Users", icon: Users },
]

export function HeroSection() {
  const [role, setRole] = useState("buying")
  const [requiresCourier, setRequiresCourier] = useState("no")
  const [currentHeadline, setCurrentHeadline] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [amount, setAmount] = useState("")

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
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50 py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">4.8</span>
              <span className="text-sm text-muted-foreground">From 1500+ reviews</span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="relative block overflow-hidden">
                <span
                  className={`inline-block transition-all duration-500 ease-out ${isAnimating
                    ? "translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
                    }`}
                >
                  {headlines[currentHeadline].text}{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary">
                      {headlines[currentHeadline].highlight}
                    </span>
                    <span
                      className={`absolute bottom-1 left-0 -z-0 h-3 bg-primary/20 transition-all duration-700 ease-out ${isAnimating ? "w-0" : "w-full"
                        }`}
                    />
                  </span>
                </span>
              </span>
            </h1>

            {/* Progress indicators */}
            <div className="mt-4 flex gap-2">
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentHeadline
                    ? "w-8 bg-primary"
                    : "w-4 bg-primary/30 hover:bg-primary/50"
                    }`}
                  aria-label={`Go to headline ${index + 1}`}
                />
              ))}
            </div>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Confirmdeal provides a trusted escrow platform that protects both buyers and sellers.
              Experience secure transactions with transparent processes and peace of mind.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-6">
                <RadioGroup
                  defaultValue="buying"
                  className="flex gap-2"
                  onValueChange={setRole}
                >
                  <div className="flex-1">
                    <RadioGroupItem value="selling" id="selling" className="peer sr-only" />
                    <Label
                      htmlFor="selling"
                      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${role === "selling"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                        }`}
                    >
                      {"I'm Selling"}
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="buying" id="buying" className="peer sr-only" />
                    <Label
                      htmlFor="buying"
                      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${role === "buying"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                        }`}
                    >
                      {"I'm Buying"}
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="brokering" id="brokering" className="peer sr-only" />
                    <Label
                      htmlFor="brokering"
                      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${role === "brokering"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                        }`}
                    >
                      {"I'm Brokering"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
                    Select Category
                  </Label>
                  <Select>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-foreground">
                    Do you require postal or courier services?
                  </Label>
                  <RadioGroup
                    defaultValue="no"
                    className="flex gap-4"
                    onValueChange={setRequiresCourier}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="courier-yes" />
                      <Label htmlFor="courier-yes" className="text-sm text-muted-foreground">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="courier-no" />
                      <Label htmlFor="courier-no" className="text-sm text-muted-foreground">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="amount" className="mb-2 block text-sm font-medium text-foreground">
                    Transaction Amount
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={handleAmountChange}
                      className="pl-8 text-lg font-medium"
                    />
                  </div>
                </div>

                <Button className="mt-4 w-full" size="lg" asChild>
                  <a href="/register">
                    Start Escrowing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
