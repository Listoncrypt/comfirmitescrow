"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, X } from "lucide-react"
import { useState } from "react"

const blogPosts = [
  {
    id: 1,
    title: "What if there is a disagreement during the transaction? What is dispute resolution?",
    excerpt: "The landscape of escrow services has evolved significantly, with dispute resolution becoming a crucial component of secure transactions...",
    fullContent: `The landscape of escrow services has evolved significantly, with dispute resolution becoming a crucial component of secure transactions.

When a dispute arises during an escrow transaction, our platform provides a structured resolution process that ensures fairness for all parties involved.

**How Dispute Resolution Works:**

1. **Initial Review**: When either party raises a dispute, our team immediately reviews the transaction details and communication history.

2. **Evidence Collection**: Both parties are given the opportunity to submit evidence supporting their position, including documents, screenshots, and correspondence.

3. **Mediation**: Our trained mediators facilitate communication between parties to reach an amicable resolution.

4. **Final Decision**: If mediation fails, our arbitration team makes a final, binding decision based on the evidence and terms of the original agreement.

**Key Benefits:**
- Fair and impartial resolution process
- Quick turnaround times (typically 5-7 business days)
- Professional mediators with industry expertise
- Transparent communication throughout the process

Our dispute resolution system has successfully resolved over 98% of cases, ensuring both buyers and sellers can transact with confidence.`,
    date: "January 15, 2026",
    category: "Disputes",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Payment Processing: Mass positive reports are empowering this web portal safe and secure",
    excerpt: "Security is at the heart of every transaction on our platform. Learn how our payment processing system keeps your funds safe...",
    fullContent: `Security is at the heart of every transaction on our platform. Learn how our payment processing system keeps your funds safe and why users trust Confirmdeal for their most important transactions.

**Our Multi-Layer Security Approach:**

At Confirmdeal, we employ a comprehensive security infrastructure that protects your funds at every stage of the transaction.

// ... (abbreviated for tool, doing targeted replace if possible or full block)
// Actually I should do targeted replacements to avoid large blocks if possible.
// But AllowMultiple is true.


**Our Multi-Layer Security Approach:**

At Confirmdeal, we employ a comprehensive security infrastructure that protects your funds at every stage of the transaction.

**Bank-Grade Encryption**
All financial data is encrypted using AES-256 encryption, the same standard used by leading financial institutions worldwide. Your payment information is never stored in plain text.

**Secure Payment Partners**
We partner with PCI DSS Level 1 compliant payment processors, ensuring that every transaction meets the highest security standards in the industry.

**Real-Time Fraud Detection**
Our AI-powered fraud detection system monitors transactions 24/7, identifying and blocking suspicious activity before it can affect your account.

**What Our Users Say:**
- 99.9% of users report feeling secure using our platform
- Zero major security breaches since our founding
- Average fraud prevention rate of 99.7%

**Continuous Improvement**
We regularly undergo independent security audits and penetration testing to identify and address potential vulnerabilities before they can be exploited.

Trust Confirmdeal for your secure payment processing needs.`,
    date: "January 10, 2026",
    category: "Security",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "What is an Escrow Agreement?",
    excerpt: "An escrow agreement is a legally binding contract that outlines the terms and conditions under which funds or assets are held...",
    fullContent: `An escrow agreement is a legally binding contract that outlines the terms and conditions under which funds or assets are held by a neutral third party during a transaction.

**Understanding Escrow Agreements:**

An escrow agreement serves as the foundation of any secure transaction, clearly defining the responsibilities and expectations of all parties involved.

**Key Components of an Escrow Agreement:**

1. **Party Identification**: Clear identification of the buyer, seller, and escrow agent (Confirmdeal).

2. **Transaction Details**: Specific description of the goods, services, or assets being exchanged.

3. **Payment Terms**: The amount to be held in escrow, payment method, and release conditions.

4. **Timeline**: Expected completion dates and milestones for the transaction.

5. **Conditions for Release**: Specific criteria that must be met before funds are released.

6. **Dispute Resolution**: Process for handling disagreements between parties.

**Why Escrow Agreements Matter:**

- **Legal Protection**: Provides a legally enforceable framework for the transaction
- **Clear Expectations**: Ensures all parties understand their obligations
- **Risk Mitigation**: Reduces the risk of fraud or misunderstanding
- **Documentation**: Creates a paper trail for accountability

**Creating Your Escrow Agreement with Confirmdeal:**

Our platform automatically generates comprehensive escrow agreements tailored to your specific transaction, ensuring all legal requirements are met while making the process simple and straightforward.

Start your secure transaction today with Confirmdeal.`,
    date: "January 5, 2026",
    category: "Education",
    readTime: "6 min read",
  },
]

export function BlogSection() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  const handleReadMore = (postId: number) => {
    setExpandedPost(postId)
    document.body.style.overflow = "hidden"
  }

  const handleClose = () => {
    setExpandedPost(null)
    document.body.style.overflow = "auto"
  }

  const selectedPost = blogPosts.find((post) => post.id === expandedPost)

  return (
    <>
      <section id="blog" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our Blog
              </h2>
              <p className="mt-2 text-white/70">
                Stay informed with the latest insights on secure transactions.
              </p>
            </div>
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-amber-400/20 via-teal-500/10 to-white/5" />
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-400">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/60">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-amber-400">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="mt-4 inline-flex items-center text-sm font-medium text-amber-400 transition-all hover:gap-2"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {expandedPost && selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-muted-foreground">{selectedPost.readTime}</span>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {selectedPost.date}
              </div>
              <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                {selectedPost.title}
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {selectedPost.fullContent.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <h3 key={index} className="mb-3 mt-6 text-lg font-semibold text-foreground">
                        {paragraph.replace(/\*\*/g, "")}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={index} className="mb-4 list-disc pl-5">
                        {paragraph.split("\n").map((item, i) => (
                          <li key={i} className="mb-1">
                            {item.replace("- ", "")}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (paragraph.match(/^\d\./)) {
                    return (
                      <ol key={index} className="mb-4 list-decimal pl-5">
                        {paragraph.split("\n").map((item, i) => (
                          <li key={i} className="mb-2">
                            {item.replace(/^\d\.\s\*\*/, "").replace(/\*\*:/, ":")}
                          </li>
                        ))}
                      </ol>
                    )
                  }
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
