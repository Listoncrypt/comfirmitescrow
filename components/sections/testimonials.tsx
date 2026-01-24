"use client"

import { useState } from "react"
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

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what our customers have to say about their experience with Confirmit.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="mx-auto max-w-4xl overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                    <Quote className="mx-auto mb-6 h-10 w-10 text-primary/30" />
                    <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                        {testimonial.avatar}
                      </div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-border"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
