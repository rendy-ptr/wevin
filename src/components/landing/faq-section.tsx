'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQS } from '@/constants/faq-section';

export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="font-script text-primary mb-2 text-2xl">FAQ</p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground">
            Jawaban untuk pertanyaan yang sering ditanyakan.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border-border rounded-xl border px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-foreground py-5 text-left font-serif text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
