"use client";

import { useState, useEffect, ReactNode, ComponentType } from "react";
import { ChevronDown, ChevronUp, Shield, Truck, Star, Leaf, Award, Users, FileText, ArrowLeft} from "lucide-react";
import { IconType } from "react-icons/lib";


export default function PolicyPages() {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<string>('about');

    interface StandalonePageProps {
        title: string;
        children: ReactNode;
        icon: ComponentType<{ className?: string }>; // assuming your Icon is a React component
    }


    // Check URL hash on load to open specific sections
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
            <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={20} className="text-gray-600" />}
                        <span className="text-lg font-medium text-black">{title}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                    )}
                </button>

                {isOpen && (
                    <div className="px-6 pb-6 bg-white border-t border-gray-200">
                        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const StandalonePage = ({ title, children, icon: Icon }: StandalonePageProps) => (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <div className="px-4 lg:px-25 py-6 border-b border-gray-200">
                <button
                    onClick={() => {
                        setCurrentPage('about');
                        window.history.pushState(null, '', '#about');
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to About
                </button>
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-black" />}
                    <h1 className="text-2xl font-medium text-black">{title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 lg:px-25 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-sm max-w-none text-gray-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    // Individual Policy Pages Content
    const PrivacyPolicyContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4">
                    At FactoryFinds, we value your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                    you visit our website or make a purchase.
                </p>
                <p className="mb-4"><strong>Effective Date:</strong> January 1, 2024</p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Information We Collect</h3>
                <h4 className="font-medium mb-2">Personal Information:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Name, email address, phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely)</li>
                    <li>Account credentials</li>
                </ul>

                <h4 className="font-medium mb-2">Usage Information:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Browser type and version</li>
                    <li>IP address and location</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer service and support</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Improve our website and services</li>
                    <li>Send promotional emails (with consent)</li>
                    <li>Prevent fraud and enhance security</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Data Security</h3>
                <p className="mb-4">
                    We implement appropriate security measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction. Your payment information
                    is processed through secure, encrypted connections and PCI-compliant payment processors.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Your Rights</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Access your personal information</li>
                    <li>Correct or update your data</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Data portability</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Contact Us</h3>
                <p>
                    For any privacy-related questions or requests, contact us at:<br />
                    Email: privacy@factoryfinds.com<br />
                    Phone: +91 9876543210
                </p>
            </div>
        </div>
    );

    const TermsConditionsContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4">
                    Welcome to FactoryFinds. These Terms and Conditions govern your use of our website
                    and the purchase of our products. By accessing our website or making a purchase,
                    you agree to be bound by these terms.
                </p>
                <p className="mb-4"><strong>Last Updated:</strong> January 1, 2024</p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Acceptance of Terms</h3>
                <p className="mb-4">
                    By using this website, you confirm that you are at least 18 years old and have
                    the legal capacity to enter into these terms.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Products and Pricing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
                    <li>We reserve the right to modify prices without prior notice</li>
                    <li>Product availability is subject to stock</li>
                    <li>We may limit quantities purchased per customer</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Order Processing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>We reserve the right to cancel orders due to pricing errors</li>
                    <li>Payment must be received before order processing</li>
                    <li>Order confirmation will be sent via email</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Intellectual Property</h3>
                <p className="mb-4">
                    All content on this website, including text, images, logos, and designs,
                    is the property of FactoryFinds and protected by intellectual property laws.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Limitation of Liability</h3>
                <p className="mb-4">
                    FactoryFinds shall not be liable for any indirect, incidental, special,
                    or consequential damages arising from your use of our products or services.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Contact Information</h3>
                <p>
                    For questions about these terms, contact us at:<br />
                    Email: legal@factoryfinds.com<br />
                    Phone: +91 9876543210
                </p>
            </div>
        </div>
    );

    const ShippingPolicyContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4">
                    At FactoryFinds, we are committed to delivering your orders quickly and safely.
                    This Shipping Policy outlines our delivery processes, timelines, and charges.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Delivery Areas</h3>
                <p className="mb-4">
                    We currently deliver across India. International shipping is not available at this time.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Shipping Options</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium mb-1">Standard Delivery (3-5 business days)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Available across India</li>
                            <li>Free on orders above ₹2,000</li>
                            <li>₹99 for orders below ₹2,000</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-1">Express Delivery (1-2 business days)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Available in metro cities</li>
                            <li>Additional ₹199 charge</li>
                            <li>Order before 2 PM for next-day delivery</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-1">Same Day Delivery</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Available in Delhi NCR, Mumbai, Bangalore</li>
                            <li>Order before 12 PM</li>
                            <li>Additional ₹299 charge</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Order Processing</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Orders are processed within 1-2 business days</li>
                    <li>You&apos;ll receive a tracking number once shipped</li>
                    <li>Weekend and holiday orders processed the next business day</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Packaging</h3>
                <p className="mb-4">
                    All orders are carefully packed in eco-friendly, tamper-proof packaging.
                    Premium orders include complimentary gift wrapping.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Tracking Your Order</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>SMS and email notifications at every step</li>
                    <li>Real-time tracking through your account</li>
                    <li>Customer support available for tracking queries</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Delivery Issues</h3>
                <p className="mb-4">
                    If you face any delivery issues, contact our support team immediately at
                    shipping@factoryfinds.com or +91 9876543210.
                </p>
            </div>
        </div>
    );

    const CancellationRefundsContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4">
                    We want you to be completely satisfied with your FactoryFinds purchase.
                    If you&apos;re not happy with your order, we offer flexible cancellation and refund options.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Order Cancellation</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium mb-1">Before Shipping:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Cancel free of charge within 2 hours of ordering</li>
                            <li>Contact customer support immediately</li>
                            <li>Full refund processed within 5-7 business days</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-1">After Shipping:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Cancellation not possible once shipped</li>
                            <li>Use our return policy instead</li>
                            <li>Refuse delivery and return shipping will be arranged</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Return Policy</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium mb-1">Return Window:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>30 days from delivery date</li>
                            <li>Items must be unused with original tags</li>
                            <li>Original packaging required</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-1">Return Process:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Initiate return through your account or customer service</li>
                            <li>Free pickup arranged within 24-48 hours</li>
                            <li>Items inspected upon receipt</li>
                            <li>Refund processed within 5-7 business days after inspection</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Exchange Policy</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Free size/color exchange within 15 days</li>
                    <li>One exchange per order</li>
                    <li>Subject to stock availability</li>
                    <li>Pickup and redelivery included</li>
                    <li>No additional charges for exchanges</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Non-Returnable Items</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Innerwear and intimate apparel</li>
                    <li>Customized or personalized items</li>
                    <li>Items damaged due to misuse</li>
                    <li>Items without original tags or packaging</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Refund Methods</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Original payment method (preferred)</li>
                    <li>Bank transfer for cash on delivery orders</li>
                    <li>Store credit (upon request)</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Contact for Returns</h3>
                <p>
                    For return and refund queries:<br />
                    Email: returns@factoryfinds.com<br />
                    Phone: +91 9876543210<br />
                    WhatsApp: +91 9876543210
                </p>
            </div>
        </div>
    );

    const ContactUsContent = () => (
        <div className="space-y-6">
            <div>
                <p className="mb-4">
                    We&apos;re here to help! Get in touch with our customer service team for any
                    questions, concerns, or feedback about your FactoryFinds experience.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Customer Support</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Email Support</h4>
                        <p className="text-sm mb-2">factoryfinds.business@gmail.com</p>
                        <p className="text-sm text-gray-600">Response time: Within 24 hours</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Phone Support</h4>
                        <p className="text-sm mb-2">+91 9027661442</p>
                        <p className="text-sm text-gray-600">Mon-Sat: 10:00 AM - 6:00 PM IST</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">WhatsApp</h4>
                        <p className="text-sm mb-2">+91 9027661442</p>
                        <p className="text-sm text-gray-600">live chat during business hours</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Live Chat</h4>
                        <p className="text-sm text-gray-600">Available on website during business hours</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Office Address</h3>
                <div className="text-sm">
                    <p className="font-medium">Factory Finds</p>
                    <p>Friends Colony</p>
                    <p>Rudrapur - 263153, India</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Business Inquiries</h3>
                <div className="space-y-2 text-sm">
                    <p><strong>Partnerships:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong>Media:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong>Careers:</strong> factoryfinds.business@gmail.com</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Specialized Support</h3>
                <div className="space-y-2 text-sm">
                    <p><strong>Returns & Exchanges:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong>Shipping Issues:</strong> factoryfinds.business@gmail.com</p>
                    <p><strong>Technical Issues:</strong> factoryfinds.business@gmail.com</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-black mb-3">Social Media</h3>
                <div className="space-y-1 text-sm">
                    <p>Instagram: @factoryfinds.store</p>
                    <p>Facebook: FactoryFinds</p>
                    <p>Twitter: @factoryfinds_in</p>
                    <p>LinkedIn: FactoryFinds</p>
                </div>
            </div>
        </div>
    );

    // Quick Navigation Menu
    const NavigationMenu = () => (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
                { id: 'privacy', title: 'Privacy Policy', icon: Shield },
                { id: 'terms', title: 'Terms & Conditions', icon: FileText },
                { id: 'shipping', title: 'Shipping Policy', icon: Truck },
                { id: 'cancellation', title: 'Cancellation & Refunds', icon: Award },
                { id: 'contact', title: 'Contact Us', icon: Users },
                { id: 'returns', title: 'Returns & Exchange', icon: Shield }
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => navigateToSection(item.id)}
                    className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={20} className="text-gray-600" />
                        <span className="text-sm font-medium text-black">{item.title}</span>
                    </div>
                </button>
            ))}
        </div>
    );

    // Render individual pages or main about page
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

    // Main About Page with all sections
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="px-4 lg:px-25 py-12 lg:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl lg:text-4xl font-normal text-black mb-6">
                        About FactoryFinds
                    </h1>
                    <p className="text-lg text-gray-700 font-extralight leading-relaxed mb-8">
                        FactoryFinds was born from a simple belief: premium clothing shouldn’t be out of reach.
                        From the very beginning, we set out to solve a problem—finding apparel that delivers
                        both exceptional design and true comfort at a fair price.
                    </p>
                    <p className="text-lg text-gray-700 font-extralight leading-relaxed mb-8">
                        Our vision is clear: to create a brand that blends
                        <span className="font-normal text-black"> premium fabrics that feel good, </span>
                        <span className="font-normal text-black"> modern, detail-rich designs that look good, </span>
                        and <span className="font-normal text-black"> fair mid-range pricing </span>
                        that makes style accessible without compromise.
                    </p>
                    <p className="text-lg text-gray-700 font-extralight leading-relaxed mb-8">
                        Today, FactoryFinds stands for confidence you can wear—crafted for dreamers, hustlers,
                        and creators alike, who deserve timeless value in every piece.
                    </p>

                    {/* Quick Navigation */}
                    <NavigationMenu />

                    {/* Brand Values */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-xl flex items-center justify-center">
                                <Star className="text-white" size={24} />
                            </div>
                            <h3 className="text-sm font-medium text-black mb-2">Premium Quality</h3>
                            <p className="text-xs text-gray-600 font-extralight">Finest fabrics and meticulous craftsmanship</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-xl flex items-center justify-center">
                                <Leaf className="text-white" size={24} />
                            </div>
                            <h3 className="text-sm font-medium text-black mb-2">Sustainable</h3>
                            <p className="text-xs text-gray-600 font-extralight">Eco-friendly practices and materials</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-xl flex items-center justify-center">
                                <Award className="text-white" size={24} />
                            </div>
                            <h3 className="text-sm font-medium text-black mb-2">Value for Money</h3>
                            <p className="text-xs text-gray-600 font-extralight">Premium quality at accessible prices</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-xl flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-sm font-medium text-black mb-2">Customer First</h3>
                            <p className="text-xs text-gray-600 font-extralight">Exceptional service and satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Information Sections */}
            <section className="px-4 lg:px-25 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* Our Story */}
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
                            <h4 className="font-medium text-black mb-2">Our Philosophy:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Quality should never be compromised for price</li>
                                <li>Timeless designs over fast fashion trends</li>
                                <li>Transparency in our sourcing and manufacturing</li>
                                <li>Building long-term relationships with our customers</li>
                            </ul>
                        </div>
                    </CollapsibleSection>

                    {/* Quality & Craftsmanship */}
                    <CollapsibleSection id="quality" title="Quality & Craftsmanship" icon={Award}>
                        <p>
                            Every garment at FactoryFinds undergoes rigorous quality control to ensure it meets our
                            premium standards. We source the finest fabrics from certified mills and work with
                            experienced artisans who share our commitment to excellence.
                        </p>
                        <div className="mt-4">
                            <h4 className="font-medium text-black mb-2">Our Quality Promise:</h4>
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

                    {/* Size Guide & Fit */}
                    <CollapsibleSection id="size-guide" title="Size Guide & Fit Information">
                        <div className="space-y-4">
                            <p>
                                Getting the right fit is crucial for your comfort and satisfaction. We provide
                                detailed size charts and fit guides for all our products.
                            </p>

                            <div>
                                <h4 className="font-medium text-black mb-2">How to Measure:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                                    <li><strong>Length:</strong> Measure from shoulder to desired hem length</li>
                                    <li><strong>Sleeve:</strong> Measure from shoulder to wrist</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-black mb-2">Fit Types:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong>Regular Fit:</strong> Classic comfortable fit for everyday wear</li>
                                    <li><strong>Slim Fit:</strong> Tailored cut for a modern silhouette</li>
                                    <li><strong>Relaxed Fit:</strong> Loose, comfortable fit for casual wear</li>
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

            {/* Footer CTA */}
            <section className="px-4 lg:px-25 py-12 bg-gray-50 border-t border-gray-300">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-normal text-black mb-4">
                        Have Questions? We&apos;re Here to Help
                    </h2>
                    <p className="text-gray-700 font-extralight mb-6">
                        Our customer support team is ready to assist you with any queries about
                        our products, policies, or services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigateToSection('contact')}
                            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Contact Support
                        </button>
                        <button className="px-6 py-3 border border-black text-black rounded-xl hover:bg-gray-50 transition-colors">
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}