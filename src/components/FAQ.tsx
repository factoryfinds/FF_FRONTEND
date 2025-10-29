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
            answer: "We accept returns only in cases of defective, damaged, or incorrect items. If you receive a product that is defective or not as described, you must email us at [factoryfinds.business@gmail.com] within 24 hours (1 day) of delivery",
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
            answer: "We photograph our products in natural lighting to show true colors. However, screens vary—there may be slight differences. our return policy has you covered.",
        },
    ];

    return (
        <section className="bg-zinc-50 py-20 sm:py-24">
            <div className="max-w-3xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="w-12 h-px bg-black mx-auto mb-6 opacity-40" />
                    <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-3">
                        Common Questions
                    </h2>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-500">
                        Everything You Need to Know
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-1 mb-16">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-gray-200">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-6 px-6 sm:px-8 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-sm sm:text-base font-medium text-gray-900 pr-6 tracking-wide">
                                    {faq.question}
                                </h3>
                                <span className="text-gray-400 text-2xl flex-shrink-0 font-light">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 sm:px-8 pb-6">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
                        Still Have Questions?
                    </p>
                    <a
                        href="mailto:factoryfinds.business@gmail.com"
                        className="inline-block bg-black text-white py-4 px-10 text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
}