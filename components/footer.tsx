import Link from "next/link"
import Image from "next/image"
import { FacebookLogo, TwitterLogo, LinkedinLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr"

const footerLinks = {
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
    { label: "Blog", href: "#blog" },
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "Contact Us", href: "#contact" },
    { label: "FAQs", href: "#faq" },
    { label: "Community", href: "#community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
    { label: "Compliance", href: "/terms#compliance" },
  ],
  services: [
    { label: "Real Estate", href: "#real-estate" },
    { label: "Vehicle Sales", href: "#vehicles" },
    { label: "Services", href: "#services" },
    { label: "Construction", href: "#construction" },
  ],
}

const socialLinks = [
  { icon: FacebookLogo, href: "#facebook", label: "Facebook" },
  { icon: TwitterLogo, href: "#twitter", label: "Twitter" },
  { icon: LinkedinLogo, href: "#linkedin", label: "LinkedIn" },
  { icon: InstagramLogo, href: "#instagram", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Confirmdeal Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">Confirmdeal</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Secure every deal with confidence. Confirmdeal is your trusted partner for safe and transparent escrow transactions worldwide.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 ring-1 ring-white/20 transition-all duration-300 hover:bg-amber-500 hover:text-black hover:shadow-md hover:shadow-amber-400/20 hover:ring-amber-400/30"
                  aria-label={social.label}
                >
                  <social.icon size={18} weight="duotone" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-amber-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Comfirmdeal. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-white/60 transition-colors hover:text-amber-400">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-white/60 transition-colors hover:text-amber-400">
              Privacy
            </Link>
            <Link href="/privacy#cookies" className="text-sm text-white/60 transition-colors hover:text-amber-400">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer >
  )
}
