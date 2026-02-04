"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Star } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    quote:
      "The escrow feature protects me from non-payment issues. I can focus on delivering quality without worrying about getting paid on time. Highly recommended!",
    name: "John Dewing",
    role: "CEO, Capital Radio",
    avatar: "JD",
    rating: 5,
  },
  {
    quote:
      "As a freelancer, trust is everything. This service's secure payment holding in escrow until project completion has made my client interactions much smoother and more professional.",
    name: "Sarah Milah",
    role: "Freelance Designer",
    avatar: "SM",
    rating: 5,
  },
  {
    quote:
      "As an international seller, the multi-currency support is a game changer. Secure transactions and easy dispute resolution make this my go-to platform for major deals.",
    name: "Michael Chen",
    role: "Entrepreneur",
    avatar: "MC",
    rating: 5,
  },
  {
    quote:
      "I appreciate the transparency and security this platform offers. Funds are safely held until I receive what I ordered, which makes shopping online worry-free.",
    name: "Emily Rodriguez",
    role: "E-commerce Buyer",
    avatar: "ER",
    rating: 4,
  },
  {
    quote:
      "The robust and secure payment processing system impressed me. It's clear the platform prioritizes safety and fairness for both parties involved in the transaction.",
    name: "Jennifer Dorbey",
    role: "Business Owner",
    avatar: "JD",
    rating: 5,
  },
]

const AUTO_PLAY_INTERVAL = 5000

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [isPaused, nextTestimonial])

  return (
    <section ref={ref} className="relative py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
      </div>

      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Testimonials
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-pretty text-lg text-white/70">
            See what our customers have to say about their experience with Confirmdeal.
          </p>
        </div>

        <div
          className={`relative mt-16 transition-all delay-200 duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
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
                  <div className="rounded-3xl border border-border/50 bg-card/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12">
                    {/* Stars */}
                    <div className="mb-6 flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          weight="fill"
                          className={i < testimonial.rating ? "text-amber-500" : "text-border"}
                        />
                      ))}
                    </div>

                    <blockquote className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
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

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="h-10 w-10 rounded-full border-border/50 bg-card/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="h-10 w-10 rounded-full border-border/50 bg-card/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
