import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | CONFIRMEDIT",
    description: "Privacy policy for CONFIRMEDIT escrow services",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-secondary via-background to-secondary/50 py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Last updated: January 24, 2026
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="prose prose-lg dark:prose-invert max-w-4xl">

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            At CONFIRMEDIT, we take your privacy seriously. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our escrow platform. Please read
                            this policy carefully to understand our practices regarding your personal data.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <div className="bg-card border border-border rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information:</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Full name and email address</li>
                                <li>Phone number</li>
                                <li>Bank account details (for withdrawals)</li>
                                <li>Transaction history and communications</li>
                                <li>Identity verification documents (when required)</li>
                            </ul>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Automatically Collected Information:</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>IP address and device information</li>
                                <li>Browser type and settings</li>
                                <li>Usage data and interaction with our platform</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Provide, maintain, and improve our escrow services</li>
                            <li>Process transactions and send related notifications</li>
                            <li>Verify your identity and prevent fraud</li>
                            <li>Communicate with you about your account and transactions</li>
                            <li>Respond to your inquiries and provide customer support</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li><strong>With Transaction Parties:</strong> Necessary transaction details are shared between buyers and sellers</li>
                            <li><strong>With Service Providers:</strong> Third parties that help us operate our platform</li>
                            <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
                            <li><strong>In Disputes:</strong> Relevant information may be shared during dispute resolution</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4 font-medium">
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Our Security Measures:</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure server infrastructure</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication measures</li>
                                <li>Employee training on data protection</li>
                            </ul>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            While we implement robust security measures, no method of transmission over the Internet
                            is 100% secure. We encourage you to use strong passwords and protect your account credentials.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We retain your personal information for as long as necessary to provide our services,
                            comply with legal obligations, resolve disputes, and enforce our agreements. Transaction
                            records are typically retained for a minimum of years for regulatory compliance.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal information</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                            <li><strong>Portability:</strong> Receive your data in a portable format</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            To exercise these rights, please contact us at confirmedit@gmail.com.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Keep you signed in</li>
                            <li>Remember your preferences</li>
                            <li>Understand how you use our platform</li>
                            <li>Improve our services</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            You can manage cookie preferences through your browser settings, though some features
                            may not function properly if cookies are disabled.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Children&apos;s Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our services are not intended for individuals under 18 years of age. We do not knowingly
                            collect personal information from children. If you believe we have collected information
                            from a child, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material
                            changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                            We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <p className="text-muted-foreground">
                                If you have questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <ul className="text-muted-foreground mt-4 space-y-2">
                                <li><strong>Email:</strong> confirmedit@gmail.com</li>
                                <li><strong>Support:</strong> confirmedit@gmail.com</li>
                                <li><strong>Website:</strong> www.confirmedit.com</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

