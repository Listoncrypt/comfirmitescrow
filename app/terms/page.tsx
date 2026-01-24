import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Confirmit",
    description: "Terms and conditions for using Confirmit escrow services",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-secondary via-background to-secondary/50 py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                        Terms of Service
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
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Confirmit&apos;s escrow services, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services. These terms apply to all users,
                            including buyers, sellers, and brokers who use our platform.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Confirmit provides escrow services that act as a trusted third party in transactions between buyers and sellers.
                            Our services include:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Holding funds securely until transaction conditions are met</li>
                            <li>Facilitating communication between transaction parties</li>
                            <li>Providing dispute resolution services</li>
                            <li>Processing payments and fund releases</li>
                            <li>Maintaining transaction records</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To use our services, you must create an account and provide accurate, complete information. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                            <li>Ensuring your account information is current and accurate</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Transaction Process</h2>
                        <div className="bg-card border border-border rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-3">How Escrow Works:</h3>
                            <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                                <li>Buyer and seller agree on transaction terms</li>
                                <li>Buyer deposits funds into Confirmit escrow</li>
                                <li>Seller delivers goods or services</li>
                                <li>Buyer inspects and confirms satisfaction</li>
                                <li>Confirmit releases funds to seller (minus platform fee)</li>
                            </ol>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Both parties must act in good faith throughout the transaction. Failure to comply with agreed terms
                            may result in dispute resolution procedures.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Fees and Payments</h2>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Platform Fees:</h3>
                            <ul className="text-muted-foreground space-y-2">
                                <li><strong>Transaction Fee:</strong> 2.5% of the transaction amount (deducted from seller&apos;s payment)</li>
                                <li><strong>Withdrawal Fee:</strong> 2.5% of the withdrawal amount</li>
                            </ul>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            All fees are non-refundable once a transaction is completed. Fees may be updated from time to time
                            with prior notice to users.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Inspection Period</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Buyers are entitled to an inspection period (typically 1-14 days as agreed upon) to examine goods
                            or verify services before confirming the transaction. During this period, buyers may:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                            <li>Accept the delivery and release funds</li>
                            <li>Open a dispute if goods/services don&apos;t match the agreement</li>
                            <li>Request additional time (subject to seller approval)</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Disputes and Resolution</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In case of disagreements, either party may open a dispute. Our dispute resolution process includes:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Review of all transaction evidence and communications</li>
                            <li>Mediation between parties</li>
                            <li>Final decision by Confirmit administrators</li>
                            <li>Fund allocation based on resolution outcome</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            Confirmit&apos;s decision in disputes is final and binding on all parties.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. Prohibited Activities</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Users are prohibited from:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Using the platform for illegal transactions</li>
                            <li>Money laundering or fraud</li>
                            <li>Creating fake accounts or impersonating others</li>
                            <li>Circumventing the escrow process</li>
                            <li>Harassing or threatening other users</li>
                            <li>Attempting to manipulate the platform or its systems</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Confirmit acts as a neutral third party and is not responsible for the quality, safety, or legality
                            of items or services transacted. We are not liable for any indirect, incidental, or consequential
                            damages arising from the use of our services. Our total liability shall not exceed the fees paid
                            to us for the specific transaction in question.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate accounts that violate these terms. Users may also
                            close their accounts at any time, provided all pending transactions are completed. Any funds
                            in escrow will be handled according to the terms of active transactions.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update these terms from time to time. Significant changes will be communicated via email
                            or platform notifications. Continued use of our services after changes constitutes acceptance
                            of the updated terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <p className="text-muted-foreground">
                                For questions about these Terms of Service, please contact us:
                            </p>
                            <ul className="text-muted-foreground mt-4 space-y-2">
                                <li><strong>Email:</strong> comfirmitescrow@gmail.com</li>
                                <li><strong>Website:</strong> www.comfirmitescrow.com</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
