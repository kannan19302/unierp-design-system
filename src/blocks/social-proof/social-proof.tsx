import styles from "./social-proof.module.css";

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface SocialProofBlockProps {
  title?: string;
  testimonials?: TestimonialItem[];
}

export function SocialProofBlock({
  title = "Loved by thousands",
  testimonials = [
    {
      quote:
        "This platform completely transformed how our team operates. It's incredibly intuitive.",
      name: "Jane Doe",
      role: "CEO",
      company: "TechCorp",
    },
    {
      quote:
        "The best investment we've made this year. Support is fantastic and the features just work.",
      name: "John Smith",
      role: "CTO",
      company: "GlobalNet",
    },
  ],
}: SocialProofBlockProps) {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.card}>
              <p className={styles.quote}>
                "{t.quote}"
              </p>
              <div>
                <strong className={styles.authorName}>
                  {t.name}
                </strong>
                <span className={styles.authorRole}>
                  {t.role}, {t.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
