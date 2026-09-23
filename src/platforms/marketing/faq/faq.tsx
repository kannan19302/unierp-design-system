import styles from "./faq.module.css";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlockProps {
  title?: string;
  faqs?: FaqItem[];
}

export function FaqBlock({
  title = "Frequently Asked Questions",
  faqs = [
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we offer a 14-day free trial on all plans with no credit card required.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Absolutely. You can cancel your plan at any time from your account settings.",
    },
    {
      question: "Do you provide onboarding support?",
      answer:
        "Yes, our Pro and Enterprise plans include dedicated onboarding sessions.",
    },
  ],
}: FaqBlockProps) {
  return (
    <section className={styles.faqSection} aria-label={title}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <h3 className={styles.question}>{f.question}</h3>
              <p className={styles.answer}>{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
