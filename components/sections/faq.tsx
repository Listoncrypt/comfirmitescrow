"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const faqs = [
  {
    question: "What is an ESCROW service?",
    answer:
      "An escrow service is a neutral third-party arrangement where funds or assets are held securely until all terms of a transaction between buyer and seller are fulfilled. It ensures that the buyer's money is protected and only released to the seller once the buyer is satisfied with the product or service.",
  },
  {
    question: "How does your ESCROW service work?",
    answer:
      "When a buyer makes a payment, the funds are held securely by the escrow provider. The seller only receives the funds after the buyer confirms that the agreed-upon goods or services have been delivered satisfactorily. If there are disputes or issues, the funds remain in escrow until resolution. This protects both parties and builds trust in the transaction.",
  },
  {
    question: "Who can use this ESCROW service?",
    answer:
      "Escrow services are available to individuals and businesses who want to ensure secure transactions. Buyers who need to pay deposits or full payments before receiving goods or services, and sellers who want assurance that funds are secured before delivery, can use escrow. Registration is usually free and requires basic personal or business information.",
  },
  {
    question: "Is my personal and financial information safe?",
    answer:
      "Yes, escrow services use secure systems and verification processes to protect your personal and financial data. They comply with regulatory standards and often require identity verification to prevent unauthorized transactions. Funds are held securely by a trusted third party until contract terms are met.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payments primarily via Electronic Funds Transfer (EFT). Some escrow services may also accept credit card payments or online payment platforms, but EFT is the most common and preferred method to ensure secure and timely processing.",
  },
  {
    question: "How long does the escrow process take?",
    answer:
      "The duration of an escrow transaction depends on the agreement between buyer and seller. Simple transactions can be completed within a few days, while complex deals involving inspections or multiple milestones may take weeks. You can track progress in real-time through our platform.",
  },
]

export function FAQSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  return (
    <section id="faq" ref={ref} className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div
            className={`lg:col-span-1 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Support
            </span>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-pretty text-white/70">
              Get quick answers to our most commonly asked questions about escrow services.
            </p>
            <Button className="mt-6 shadow-lg shadow-primary/25" variant="outline" asChild>
              <Link href="#contact">Contact Support</Link>
            </Button>
          </div>

          <div
            className={`lg:col-span-2 transition-all delay-200 duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl border border-border/50 bg-card/60 px-6 backdrop-blur-sm transition-all data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 leading-relaxed text-white/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
