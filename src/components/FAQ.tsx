
// components/FAQ.tsx
"use client";

import { useState } from "react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What makes Factory Finds t-shirts premium?",
            answer: "We use 240 GSM combed cotton—significantly heavier and softer than standard tees. Our fabric is pre-shrunk, fade-resistant, and designed to maintain shape after multiple washes. Plus, reinforced stitching ensures durability.",
        },
        {
            question: "What's your return policy?",
            answer: "We offer a hassle-free 7-day return policy. If you're not completely satisfied with your purchase, contact us within 7 days of delivery for a full refund or exchange. Product must be unworn with tags attached.",
        },
        {
            question: "How long does shipping take?",
            answer: "We process orders within 24-48 hours. Delivery typically takes 4-7 business days depending on your location. You'll receive a tracking number once your order ships.",
        },
        {
            question: "Do you offer Cash on Delivery?",
            answer: "No, we currently do not offer Cash on Delivery. However, we offer an extra 5% discount on all prepaid orders (UPI, cards, wallets) to pass on savings from payment processing.",
        },
        {
            question: "How do I choose the right size?",
            answer: "Check our detailed size chart on each product page. We provide chest, length, and shoulder measurements. If you're between sizes, we recommend sizing up for a comfortable fit. Our tees are designed for Indian body types.",
        },
        {
            question: "Are the colors accurate to the photos?",
            answer: "We photograph our products in natural lighting to show true colors. However, screens vary—there may be slight differences. If you're unhappy with the color, our return policy has you covered.",
        },
    ];

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="max-w-4xl mx-auto px-8">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="w-12 h-px bg-black mx-auto mb-6 opacity-60" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">
                        Questions?
                    </h2>
                    <p className="text-sm tracking-[0.15em] uppercase text-gray-500 font-normal">
                        We&apos;ve Got Answers
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-5 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
                            >
                                <h3 className="text-sm sm:text-base uppercase tracking-[0.1em] font-medium text-gray-900 pr-4">
                                    {faq.question}
                                </h3>
                                <span className="text-gray-400 text-xl flex-shrink-0">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="pb-6 pr-8">
                                    <p className="text-sm text-gray-600 leading-relaxed font-light">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
                        Still Have Questions?
                    </p>
                    <a
                        href="mailto:factoryfinds.business@gmail.com"
                        className="inline-block border border-gray-700 py-3 px-8 text-xs uppercase tracking-[0.15em] hover:bg-gray-100 transition-colors duration-300"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
}