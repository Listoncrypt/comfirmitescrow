"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "The escrow feature protects me from non-payment issues. I can focus on delivering quality without worrying about getting paid on time. Highly recommended!",
    name: "John Dewing",
    role: "CEO, Capital Radio",
    avatar: "JD",
  },
  {
    quote: "As a freelancer, trust is everything. This service's secure payment holding in escrow until project completion has made my client interactions much smoother and more professional.",
    name: "Sarah Milah",
    role: "Freelance Designer",
    avatar: "SM",
  },
  {
    quote: "As an international seller, the multi-currency support is a game changer. Secure transactions and easy dispute resolution make this my go-to platform for major deals.",
    name: "Michael Chen",
    role: "Entrepreneur",
    avatar: "MC",
  },
  {
    quote: "I appreciate the transparency and security this platform offers. Funds are safely held until I receive what I ordered, which makes shopping online worry-free.",
    name: "Emily Rodriguez",
    role: "E-commerce Buyer",
    avatar: "ER",
  },
  {
    quote: "The robust and secure payment processing system impressed me. It's clear the platform prioritizes safety and fairness for both parties involved in the transaction.",
    name: "Jennifer Dorbey",
    role: "Business Owner",
    avatar: "JD",
  },
]

const AUTO_PLAY_INTERVAL = 5000 // 5 seconds

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance testimonials
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [isPaused, nextTestimonial])

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-pretty text-lg text-white/70">
            See what our customers have to say about their experience with Confirmdeal.
          </p>
        </div>

        <div
          className="relative mt-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="mx-auto max-w-4xl overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center shadow-sm">
                    <Quote className="mx-auto mb-6 h-10 w-10 text-amber-400/50" />
                    <p className="mb-8 text-lg leading-relaxed text-white/80">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-lg font-semibold text-black">
                        {testimonial.avatar}
                      </div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" className="border border-white/30 bg-transparent text-white hover:bg-white/10" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${index === currentIndex ? "bg-amber-400" : "bg-white/30"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" className="border border-white/30 bg-transparent text-white hover:bg-white/10" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
