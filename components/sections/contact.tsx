"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, Clock, MapPin } from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const SUPPORT_EMAIL = "confirmdealescrow@gmail.com"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lagos, Nigeria",
    href: null,
  },
]

export function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `Name: ${name}
Email: ${email}

Message:
${message}`

    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject || "Contact Form Inquiry")}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <section id="contact" ref={ref} className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Contact Us
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-2">
          <div
            className={`space-y-8 transition-all delay-200 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div>
              <h3 className="mb-6 text-xl font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Wrapper = info.href ? "a" : "div"
                  const wrapperProps = info.href ? { href: info.href } : {}
                  return (
                    <Wrapper
                      key={info.label}
                      {...wrapperProps}
                      className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                        <p className="text-foreground group-hover:text-primary">{info.value}</p>
                      </div>
                    </Wrapper>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 backdrop-blur-sm">
              <h4 className="mb-2 font-semibold text-foreground">Business Hours</h4>
              <p className="text-sm text-muted-foreground">
                We're available <span className="font-semibold text-primary">24/7</span> to assist you with your escrow
                needs. Our support team typically responds within 24 hours.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-6 rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm transition-all delay-300 duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="h-12 rounded-xl bg-background/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 rounded-xl bg-background/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="How can we help?"
                className="h-12 rounded-xl bg-background/50"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us more about your inquiry..."
                className="min-h-[150px] resize-none rounded-xl bg-background/50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="h-12 w-full rounded-xl shadow-lg shadow-primary/25">
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              This will open your email client to send a message to our support team
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
