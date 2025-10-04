"use client";

import { useState, useEffect, ReactNode, ComponentType } from "react";
import { ChevronDown, ChevronUp, Shield, Truck, Star, Leaf, Award, Users, FileText, ArrowLeft, HelpCircle } from "lucide-react";
import { IconType } from "react-icons/lib";

export default function PolicyPages() {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<string>('about');

    interface StandalonePageProps {
        title: string;
        children: ReactNode;
        icon: ComponentType<{ className?: string }>;
    }

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setCurrentPage(hash);
            setOpenSection(hash);
        }
    }, []);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const navigateToSection = (section: string) => {
        setCurrentPage(section);
        setOpenSection(section);
        window.history.pushState(null, '', `#${section}`);
    };

    const CollapsibleSection = ({
        id,
        title,
        children,
        icon: Icon,
    }: {
        id: string;
        title: string;
        children: React.ReactNode;
        icon?: IconType;
    }) => {
        const isOpen = openSection === id;

        return (
            <div className="border border-gray-300 mb-4 overflow-hidden">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-300 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={20} className="text-black" />}
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-black">{title}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp size={20} className="text-black" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                    )}
                </button>

                {isOpen && (
                    <div className="px-6 pb-6 bg-white border-t border-gray-200">
                        <div className="text-sm text-gray-700 font-light tracking-wide leading-relaxed space-y-4 mt-6">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const StandalonePage = ({ title, children, icon: Icon }: StandalonePageProps) => (
        <div className="min-h-screen bg-white">
            <div className="px-8 lg:px-12 py-8 border-b border-gray-200">
                <button
                    onClick={() => {
                        setCurrentPage('about');
                        window.history.pushState(null, '', '#about');
                    }}
                    className="flex items-center gap-2 text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] transition-all duration-300 mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to About
                </button>
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-black" />}
                    <h1 className="text-sm sm:text-base font-black uppercase tracking-[0.15em] text-black">{title}</h1>
                </div>
            </div>

            <div className="px-8 lg:px-12 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-sm max-w-none text-gray-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    const PrivacyPolicyContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4 font-light tracking-wide">
                    At FactoryFinds, we value your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                    you visit our website or make a purchase.
                </p>
                <p className="mb-4 font-light tracking-wide"><strong className="font-black uppercase tracking-wider text-xs">Effective Date:</strong> January 1, 2024</p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Information We Collect</h3>
                <h4 className="font-black uppercase tracking-wider text-xs mb-2">Personal Information:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>Name, email address, phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely)</li>
                    <li>Account credentials</li>
                </ul>

                <h4 className="font-black uppercase tracking-wider text-xs mb-2">Usage Information:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>Browser type and version</li>
                    <li>IP address and location</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-1 font-light tracking-wide">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer service and support</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Improve our website and services</li>
                    <li>Send promotional emails (with consent)</li>
                    <li>Prevent fraud and enhance security</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Data Security</h3>
                <p className="mb-4 font-light tracking-wide">
                    We implement appropriate security measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction. Your payment information
                    is processed through secure, encrypted connections and PCI-compliant payment processors.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Your Rights</h3>
                <ul className="list-disc list-inside space-y-1 font-light tracking-wide">
                    <li>Access your personal information</li>
                    <li>Correct or update your data</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Data portability</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Contact Us</h3>
                <p className="font-light tracking-wide">
                    For any privacy-related questions or requests, contact us at:<br />
                    Email: factoryfinds.business@gmail.com<br />
                </p>
            </div>
        </div>
    );

    const TermsConditionsContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4 font-light tracking-wide">
                    Welcome to FactoryFinds. These Terms and Conditions govern your use of our website
                    and the purchase of our products. By accessing our website or making a purchase,
                    you agree to be bound by these terms.
                </p>
                <p className="mb-4 font-light tracking-wide"><strong className="font-black uppercase tracking-wider text-xs">Last Updated:</strong> October 4, 2025</p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Acceptance of Terms</h3>
                <p className="mb-4 font-light tracking-wide">
                    By using this website, you confirm that you are at least 18 years old and have
                    the legal capacity to enter into these terms.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Products and Pricing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
                    <li>We reserve the right to modify prices without prior notice</li>
                    <li>Product availability is subject to stock</li>
                    <li>We may limit quantities purchased per customer</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Order Processing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>We reserve the right to cancel orders due to pricing errors</li>
                    <li>Payment must be received before order processing</li>
                    {/* <li>Order confirmation will be sent via email</li> */}
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Intellectual Property</h3>
                <p className="mb-4 font-light tracking-wide">
                    All content on this website, including text, images, logos, and designs,
                    is the property of FactoryFinds and protected by intellectual property laws.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Limitation of Liability</h3>
                <p className="mb-4 font-light tracking-wide">
                    FactoryFinds shall not be liable for any indirect, incidental, special,
                    or consequential damages arising from your use of our products or services.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Contact Information</h3>
                <p className="font-light tracking-wide">
                    For questions about these terms, contact us at:<br />
                    Email: factoryfinds.business@gmail.com<br />
                </p>
            </div>
        </div>
    );

    const ShippingPolicyContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4 font-light tracking-wide">
                    At FactoryFinds, we are committed to delivering your orders quickly and safely.
                    This Shipping Policy outlines our delivery processes, timelines, and charges.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Delivery Areas</h3>
                <p className="mb-4 font-light tracking-wide">
                    We currently deliver across India. International shipping is not available at this time.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Shipping Options</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-1">Standard Delivery (5-8 business days)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 font-light tracking-wide">
                            <li>Available across India</li>
                            <li>Free on all orders</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Order Processing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>You&apos;ll receive a tracking number once shipped</li>
                    <li>Weekend and holiday orders processed the next business day</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Packaging</h3>
                <p className="mb-4 font-light tracking-wide">
                    All orders are carefully packed in eco-friendly, tamper-proof packaging.
                    Premium orders include complimentary gift wrapping.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Tracking Your Order</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                    <li>SMS and email notifications</li>
                    <li>Customer support available for tracking queries</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Delivery Issues</h3>
                <p className="mb-4 font-light tracking-wide">
                    If you face any delivery issues, contact our support team immediately at
                    factoryfinds.business@gmail.com
                </p>
            </div>
        </div>
    );

    const CancellationRefundsContent = () => (
    <div className="space-y-6">
        <div>
            <p className="mb-4 font-light tracking-wide">
                We want you to be completely satisfied with your FactoryFinds purchase.
                Please read our cancellation and return policies carefully.
            </p>
        </div>

        <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Order Cancellation</h3>
            <div className="space-y-3">
                <div>
                    <h4 className="font-black uppercase tracking-wider text-xs mb-1">Before Processing:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 font-light tracking-wide">
                        <li>Orders can be canceled <strong>within 10 minutes</strong> of placing the order.</li>
                        <li>Cancellation must be requested via <strong>email at [factoryfinds.business@gmail.com]</strong>.</li>
                        <li>Cancellation requests will only be entertained if the order has <strong>not been processed</strong>.</li>
                        <li>Approved cancellations will be refunded to the original payment method.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-black uppercase tracking-wider text-xs mb-1">After Processing:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 font-light tracking-wide">
                        <li>Orders cannot be canceled once processed, packed, or shipped.</li>
                        <li>Use the Return & Refund Policy only for defective items.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Return & Refund Policy</h3>
            <div className="space-y-3">
                <p className="text-sm font-light tracking-wide">
                    Returns are accepted <strong>only for defective, damaged, or incorrect items</strong>.  
                    If you receive such an item, you must <strong>email us at [factoryfinds.business@gmail.com] within 24 hours of delivery</strong> with:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 font-light tracking-wide">
                    <li>Clear photos showing the defect</li>
                    <li>A complete <strong>unboxing video</strong> showing the package being opened for the first time</li>
                </ul>
                <p className="text-sm font-light tracking-wide">
                    The unboxing video is <strong>mandatory</strong>. Return requests without a valid video will not be accepted.  
                    Items must be <strong>unused, unwashed, and in their original packaging</strong> with tags intact.  
                    Defective items confirmed by our team will be replaced or refunded to the original payment method.  
                    Requests made after 24 hours of delivery will not be entertained.
                </p>
            </div>
        </div>

        <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Non-Returnable Items</h3>
            <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                <li>Items without defects or damage</li>
                <li>Items damaged due to misuse</li>
                <li>Items without original tags, packaging, or unboxing video</li>
            </ul>
        </div>

        <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Payment & Refund Methods</h3>
            <ul className="list-disc list-inside space-y-1 mb-4 font-light tracking-wide">
                <li>All payments are processed securely via Razorpay</li>
                <li>Accepted payment methods: UPI, QR Code, Net Banking, Credit/Debit Cards</li>
                <li>Refunds for approved defective items will be issued to the original payment method</li>
            </ul>
        </div>

        <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Contact for Returns</h3>
            <p className="font-light tracking-wide">
                For defective item returns or refund queries:<br />
                Email: [factoryfinds.business@gmail.com]<br />
            </p>
        </div>
    </div>
);


    const ContactUsContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4 font-light tracking-wide">
                    We&apos;re here to help! Get in touch with our customer service team for any
                    questions, concerns, or feedback about your FactoryFinds experience.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Customer Support</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Email Support</h4>
                        <p className="text-sm mb-2 font-light tracking-wide">factoryfinds.business@gmail.com</p>
                        <p className="text-sm text-gray-600 font-light tracking-wide">Response time: Within 24 hours</p>
                    </div>

                
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">WhatsApp</h4>
                        <p className="text-sm mb-2 font-light tracking-wide">+91 9027661442</p>
                        <p className="text-sm text-gray-600 font-light tracking-wide">live chat during business hours</p>
                    </div>

                   
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Office Address</h3>
                <div className="text-sm font-light tracking-wide">
                    <p className="font-black uppercase tracking-wider text-xs">Factory Finds</p>
                    <p>Friends Colony</p>
                    <p>Rudrapur - 263153, India</p>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Business Inquiries</h3>
                <div className="space-y-2 text-sm font-light tracking-wide">
                    <p><strong className="font-black uppercase tracking-wider text-xs">Partnerships:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">Media:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">Careers:</strong> factoryfinds.business@gmail.com</p>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Specialized Support</h3>
                <div className="space-y-2 text-sm font-light tracking-wide">
                    <p><strong className="font-black uppercase tracking-wider text-xs">Returns & Exchanges:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">Shipping Issues:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">Technical Issues:</strong> factoryfinds.business@gmail.com</p>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Social Media</h3>
                <div className="space-y-1 text-sm font-light tracking-wide">
                    <p>Instagram: @factoryfinds.store</p>
                    <p>LinkedIn: FactoryFinds</p>
                </div>
            </div>
        </div>
    );

    const FAQContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4 font-light tracking-wide">
                    Find quick answers to the most common questions about our clothing, ordering, and policies.
                </p>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Clothing & Quality</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What fabrics do you use?</h4>
                        <p className="text-sm font-light tracking-wide">We exclusively use premium 100% cotton, cotton blends, and high-quality synthetic fabrics to ensure comfort, durability, and style.
                            Our products are crafted using 240 GSM cotton, terry cotton, and bio-washed materials for a smooth, long-lasting finish.
                            All fabrics are pre-shrunk, color-fast, and sourced from certified mills, maintaining consistent quality and fit across every piece.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">How do I care for my FactoryFinds clothing?</h4>
                        <p className="text-sm font-light tracking-wide">Machine wash cold, tumble dry low, or hang dry. Iron on low heat if needed. Avoid bleach and harsh detergents. Care labels are included with each garment for specific instructions.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Will the colors fade after washing?</h4>
                        <p className="text-sm font-light tracking-wide">No. We use premium color-fast dyes that resist fading. To maintain vibrancy, wash in cold water and avoid direct sunlight when drying.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Are your clothes pre-shrunk?</h4>
                        <p className="text-sm font-light tracking-wide">Yes. All our garments are pre-shrunk during manufacturing to ensure minimal shrinkage and consistent sizing.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Sizing & Fit</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">How do I choose the right size?</h4>
                        <p className="text-sm font-light tracking-wide">Check our detailed size chart on each product page. Measure your chest, waist, and length, then compare with our measurements. If between sizes, size up for a relaxed fit or size down for a fitted look.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What if my size is out of stock?</h4>
                        <p className="text-sm font-light tracking-wide">Click &quot;Notify Me&quot; on the product page to receive an email when your size is back in stock. Restocks typically happen within 2-3 weeks.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Can I exchange for a different size?</h4>
                        <p className="text-sm font-light tracking-wide">Yes. Free size exchanges within 15 days of delivery. We arrange pickup and redelivery at no additional cost, subject to stock availability.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What is the difference between Regular, Slim, and Relaxed fit?</h4>
                        <p className="text-sm font-light tracking-wide">Regular fit is our classic comfortable cut. Slim fit is more tailored for a modern silhouette. Relaxed fit offers a loose, comfortable style. Each product page specifies the fit type.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Orders & Shipping</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">How long does delivery take?</h4>
                        <p className="text-sm font-light tracking-wide">Standard delivery: 5-8 business days</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Is shipping free?</h4>
                        <p className="text-sm font-light tracking-wide">Yes, free standard shipping on all orders. </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Can I track my order?</h4>
                        <p className="text-sm font-light tracking-wide">Yes. You&apos;ll receive a tracking number via whatsapp and email once your order ships. Track real-time updates through your account or the tracking link.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What if I&apos;m not home during delivery?</h4>
                        <p className="text-sm font-light tracking-wide">Our courier will attempt delivery 2-3 times. You can also reschedule delivery or arrange for pickup from the nearest hub through the tracking link.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Returns & Exchanges</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What is your return policy?</h4>
                        <p className="text-sm font-light tracking-wide leading-relaxed">
                            We accept returns <strong>only in cases of defective, damaged, or incorrect items.</strong><br /><br />

                            If you receive a product that is defective or not as described, you must
                            <strong> email us at [factoryfinds.business@gmail.com] within 24 hours (1 day) of delivery</strong>,
                            attaching clear photos and a complete <strong>unboxing video</strong> showing the issue.<br /><br />

                            The <strong>unboxing video is mandatory</strong> — it must clearly show the package being opened for the first time,
                            without any cuts or edits. Return requests without a valid unboxing video will
                            <strong> not be accepted under any circumstance.</strong><br /><br />

                            Our team will review your request, and if approved, we will arrange a replacement or refund as per our inspection outcome.<br /><br />

                            <strong>To qualify for a return or refund:</strong><br />
                            <ul className="list-disc list-inside mt-2">
                                <li>The item must be <strong>unused</strong>, <strong>unwashed</strong>, and in its <strong>original packaging</strong> with all tags intact.</li>
                                <li>The defect must be clearly visible in the unboxing video and not due to misuse, washing, or normal wear and tear.</li>
                                <li>The return request must be made <strong>within 24 hours of delivery.</strong></li>
                                <li>Requests made after this period will <strong>not be entertained.</strong></li>
                            </ul>
                            <br />
                            We do not accept returns or exchanges for reasons such as size, color preference, or change of mind.
                        </p>

                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">How do I initiate a return?</h4>
                        <p className="text-sm font-light tracking-wide">contact customer support via email/phone/WhatsApp.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">When will I receive my refund?</h4>
                        <p className="text-sm font-light tracking-wide">Refunds are processed within 5-7 business days after we receive and inspect your returned item. Money will be credited to your original payment method only if the item is unused.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Can I return sale items?</h4>
                        <p className="text-sm font-light tracking-wide">Yes. Sale items follow the same return policy as regular-priced items</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Payment & Security</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">What payment methods do you accept?</h4>
                        <p className="text-sm font-light tracking-wide">Credit/debit cards, UPI, net banking, digital wallets. All transactions are encrypted and secure.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Is it safe to enter my card details?</h4>
                        <p className="text-sm font-light tracking-wide">Absolutely. All payments on our store are processed securely through Razorpay, a trusted and PCI-DSS compliant payment gateway. We never store your complete card details on our servers.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Do you offer Cash on Delivery?</h4>
                        <p className="text-sm font-light tracking-wide">We currently do not offer Cash on Delivery.
                            This feature will be introduced soon to make your shopping experience even smoother.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Account & Orders</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Do I need to create an account to order?</h4>
                        <p className="text-sm font-light tracking-wide">Yes, creating an account lets you track orders, save addresses, and enjoy faster checkout for future purchases.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">How do I cancel my order?</h4>
                        <p className="text-sm font-light tracking-wide">Orders can be canceled only within 10 minutes of placing the order, and only if the order has not yet been processed or dispatched.

                            To request a cancellation, the customer must email us at [factoryfinds.business@gmail.com] within this 10-minute window, using the same email address used at checkout.
                            Cancellations sent through social media, chat, or phone will not be accepted.

                            Once an order is processed, packed, or shipped, it cannot be canceled under any circumstances.
                            If your cancellation request is received and approved before processing, a full refund will be issued to your original payment method.</p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-wider text-xs mb-2">Can I modify my order after placing it?</h4>
                        <p className="text-sm font-light tracking-wide">Contact us immediately within 2 hours of ordering. We&apos;ll try our best to modify size, color, or address if the order hasn&apos;t been processed yet.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-3">Still Have Questions?</h3>
                <p className="text-sm font-light tracking-wide mb-4">
                    Can&apos;t find the answer you&apos;re looking for? Our customer support team is ready to help.
                </p>
                <div className="space-y-2 text-sm font-light tracking-wide">
                    <p><strong className="font-black uppercase tracking-wider text-xs">Email:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">Phone:</strong> +91 9027661442</p>
                    <p><strong className="font-black uppercase tracking-wider text-xs">WhatsApp:</strong> +91 9027661442</p>
                    <p className="text-xs text-gray-600 mt-2">Mon-Sat: 10:00 AM - 6:00 PM IST</p>
                </div>
            </div>
        </div>
    );

    const NavigationMenu = () => (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
                { id: 'faq', title: 'FAQ', icon: HelpCircle },
                { id: 'privacy', title: 'Privacy Policy', icon: Shield },
                { id: 'terms', title: 'Terms & Conditions', icon: FileText },
                { id: 'shipping', title: 'Shipping Policy', icon: Truck },
                { id: 'cancellation', title: 'Cancellation & Refunds', icon: Award },
                { id: 'contact', title: 'Contact Us', icon: Users }
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => navigateToSection(item.id)}
                    className="p-4 border border-gray-300 hover:border-black transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={20} className="text-black" />
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-black">{item.title}</span>
                    </div>
                </button>
            ))}
        </div>
    );

    if (currentPage === 'faq') {
        return <StandalonePage title="Frequently Asked Questions" icon={HelpCircle}><FAQContent /></StandalonePage>;
    }

    if (currentPage === 'privacy') {
        return <StandalonePage title="Privacy Policy" icon={Shield}><PrivacyPolicyContent /></StandalonePage>;
    }

    if (currentPage === 'terms') {
        return <StandalonePage title="Terms & Conditions" icon={FileText}><TermsConditionsContent /></StandalonePage>;
    }

    if (currentPage === 'shipping') {
        return <StandalonePage title="Shipping Policy" icon={Truck}><ShippingPolicyContent /></StandalonePage>;
    }

    if (currentPage === 'cancellation') {
        return <StandalonePage title="Cancellation & Refunds" icon={Award}><CancellationRefundsContent /></StandalonePage>;
    }

    if (currentPage === 'contact') {
        return <StandalonePage title="Contact Us" icon={Users}><ContactUsContent /></StandalonePage>;
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="px-8 lg:px-12 py-12 lg:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-sm sm:text-base font-black text-black uppercase tracking-[0.15em] mb-8">
                        About FactoryFinds
                    </h1>
                    <p className="text-sm text-gray-700 font-light tracking-wide leading-relaxed mb-6">
                        FactoryFinds was born from a simple belief: premium clothing shouldn&apos;t be out of reach.
                        From the very beginning, we set out to solve a problem—finding apparel that delivers
                        both exceptional design and true comfort at a fair price.
                    </p>
                    <p className="text-sm text-gray-700 font-light tracking-wide leading-relaxed mb-6">
                        Our vision is clear: to create a brand that blends
                        <span className="font-black text-black"> premium fabrics that feel good, </span>
                        <span className="font-black text-black"> modern, detail-rich designs that look good, </span>
                        and <span className="font-black text-black"> fair mid-range pricing </span>
                        that makes style accessible without compromise.
                    </p>
                    <p className="text-sm text-gray-700 font-light tracking-wide leading-relaxed mb-8">
                        Today, FactoryFinds stands for confidence you can wear—crafted for dreamers, hustlers,
                        and creators alike, who deserve timeless value in every piece.
                    </p>

                    <NavigationMenu />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black flex items-center justify-center">
                                <Star className="text-white" size={24} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-2">Premium Quality</h3>
                            <p className="text-xs text-gray-600 font-light tracking-wide">Finest fabrics and meticulous craftsmanship</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black flex items-center justify-center">
                                <Leaf className="text-white" size={24} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-2">Sustainable</h3>
                            <p className="text-xs text-gray-600 font-light tracking-wide">Eco-friendly practices and materials</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black flex items-center justify-center">
                                <Award className="text-white" size={24} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-2">Value for Money</h3>
                            <p className="text-xs text-gray-600 font-light tracking-wide">Premium quality at accessible prices</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-black mb-2">Customer First</h3>
                            <p className="text-xs text-gray-600 font-light tracking-wide">Exceptional service and satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-8 lg:px-12 py-8">
                <div className="max-w-4xl mx-auto">

                    <CollapsibleSection id="story" title="Our Story & Philosophy" icon={Star}>
                        <p>
                            Founded with a vision to democratize premium fashion, FactoryFinds bridges the gap between
                            luxury quality and accessible pricing. We believe that everyone deserves to wear clothing
                            that makes them feel confident and comfortable.
                        </p>
                        <p>
                            Our journey began with a simple question: Why should premium quality clothing be exclusive
                            to a few? This led us to work directly with manufacturers, cutting out middlemen to bring
                            you the finest fabrics and craftsmanship at unbeatable prices.
                        </p>
                        <div className="mt-4">
                            <h4 className="font-black uppercase tracking-wider text-xs text-black mb-2">Our Philosophy:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Quality should never be compromised for price</li>
                                <li>Timeless designs over fast fashion trends</li>
                                <li>Transparency in our sourcing and manufacturing</li>
                                <li>Building long-term relationships with our customers</li>
                            </ul>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection id="quality" title="Quality & Craftsmanship" icon={Award}>
                        <p>
                            Every garment at FactoryFinds undergoes rigorous quality control to ensure it meets our
                            premium standards. We source the finest fabrics from certified mills and work with
                            experienced artisans who share our commitment to excellence.
                        </p>
                        <div className="mt-4">
                            <h4 className="font-black uppercase tracking-wider text-xs text-black mb-2">Our Quality Promise:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>100% premium cotton and natural fiber blends</li>
                                <li>Pre-shrunk fabrics for consistent fit</li>
                                <li>Reinforced stitching for durability</li>
                                <li>Color-fast dyes that won&apos;t fade</li>
                                <li>Multiple quality checks before dispatch</li>
                            </ul>
                        </div>
                        <p className="mt-4">
                            We stand behind our quality with a comprehensive warranty and hassle-free return policy.
                            If you&apos;re not completely satisfied with your purchase, we&apos;ll make it right.
                        </p>
                    </CollapsibleSection>

                    <CollapsibleSection id="size-guide" title="Size Guide & Fit Information">
                        <div className="space-y-4">
                            <p>
                                Getting the right fit is crucial for your comfort and satisfaction. We provide
                                detailed size charts and fit guides for all our products.
                            </p>

                            <div>
                                <h4 className="font-black uppercase tracking-wider text-xs text-black mb-2">How to Measure:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Chest:</strong> Measure around the fullest part of your chest</li>
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Waist:</strong> Measure around your natural waistline</li>
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Length:</strong> Measure from shoulder to desired hem length</li>
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Sleeve:</strong> Measure from shoulder to wrist</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-black uppercase tracking-wider text-xs text-black mb-2">Fit Types:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Regular Fit:</strong> Classic comfortable fit for everyday wear</li>
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Slim Fit:</strong> Tailored cut for a modern silhouette</li>
                                    <li><strong className="font-black uppercase tracking-wider text-xs">Relaxed Fit:</strong> Loose, comfortable fit for casual wear</li>
                                </ul>
                            </div>

                            <p className="text-sm">
                                Still unsure about sizing? Contact our customer service team for personalized
                                fit recommendations based on your measurements and preferences.
                            </p>
                        </div>
                    </CollapsibleSection>
                </div>
            </section>

            <section className="px-8 lg:px-12 py-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-black mb-4">
                        Have Questions? We&apos;re Here to Help
                    </h2>
                    <p className="text-sm text-gray-700 font-light tracking-wide mb-8">
                        Our customer support team is ready to assist you with any queries about
                        our products, policies, or services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigateToSection('contact')}
                            className="px-8 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
                        >
                            Contact Support
                        </button>
                        <button className="px-8 py-4 border border-black text-black text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-50 transition-all duration-300">
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}