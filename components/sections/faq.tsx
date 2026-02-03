import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    question: "What is an ESCROW service?",
    answer: "An escrow service is a neutral third-party arrangement where funds or assets are held securely until all terms of a transaction between buyer and seller are fulfilled. It ensures that the buyer's money is protected and only released to the seller once the buyer is satisfied with the product or service.",
  },
  {
    question: "How does your ESCROW service work?",
    answer: "When a buyer makes a payment, the funds are held securely by the escrow provider. The seller only receives the funds after the buyer confirms that the agreed-upon goods or services have been delivered satisfactorily. If there are disputes or issues, the funds remain in escrow until resolution. This protects both parties and builds trust in the transaction.",
  },
  {
    question: "Who can use this ESCROW service?",
    answer: "Escrow services are available to individuals and businesses who want to ensure secure transactions. Buyers who need to pay deposits or full payments before receiving goods or services, and sellers who want assurance that funds are secured before delivery, can use escrow. Registration is usually free and requires basic personal or business information.",
  },
  {
    question: "Is my personal and financial information safe?",
    answer: "Yes, escrow services use secure systems and verification processes to protect your personal and financial data. They comply with regulatory standards and often require identity verification to prevent unauthorized transactions. Funds are held securely by a trusted third party until contract terms are met.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept payments primarily via Electronic Funds Transfer (EFT). Some escrow services may also accept credit card payments or online payment platforms, but EFT is the most common and preferred method to ensure secure and timely processing.",
  },
  {
    question: "How long does the escrow process take?",
    answer: "The duration of an escrow transaction depends on the agreement between buyer and seller. Simple transactions can be completed within a few days, while complex deals involving inspections or multiple milestones may take weeks. You can track progress in real-time through our platform.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
              FAQs
            </h2>
            <p className="mt-4 text-pretty text-white/70">
              Get quick answers to our most commonly asked questions.
            </p>
            <Button className="mt-6 border-white/20 bg-transparent text-white hover:bg-white/10" variant="outline" asChild>
              <Link href="#contact">Contact Support</Link>
            </Button>
          </div>

          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-base font-medium text-white hover:text-amber-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 leading-relaxed">
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
